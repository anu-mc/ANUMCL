pub mod desc;
mod handle;
pub mod reporter;
mod unit;

use futures::Stream;
use futures::stream::FusedStream;
use pin_project::pin_project;
use serde::{Deserialize, Serialize};
use std::pin::Pin;
use std::sync::{Arc, RwLock};
use std::task::{Context, Poll};
use unit::Unit;

pub use desc::{GDesc, PDesc};
pub use handle::PHandle;
use reporter::*;

#[pin_project]
pub struct ProgressStream<M, U, S, P>
where
  M: Stream<Item = U>,
  U: Unit,
  S: Sink,
  P: Clone + Serialize + for<'de> Deserialize<'de>,
{
  #[pin]
  stream: M,
  handle: Arc<RwLock<PHandle<S, P>>>,
  complete_on_end: bool,
}

impl<M, U, S, P> ProgressStream<M, U, S, P>
where
  M: Stream<Item = U>,
  U: Unit,
  S: Sink,
  P: Clone + Serialize + for<'de> Deserialize<'de>,
{
  pub fn new(stream: M, handle: Arc<RwLock<PHandle<S, P>>>) -> Self {
    Self {
      stream,
      handle,
      complete_on_end: true,
    }
  }

  pub fn new_without_completion(stream: M, handle: Arc<RwLock<PHandle<S, P>>>) -> Self {
    Self {
      stream,
      handle,
      complete_on_end: false,
    }
  }
}

impl<M, U, S, P> Stream for ProgressStream<M, U, S, P>
where
  M: Stream<Item = U>,
  U: Unit,
  S: Sink,
  P: Clone + Serialize + for<'de> Deserialize<'de>,
{
  type Item = U;

  fn poll_next(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Option<Self::Item>> {
    {
      let mut h = self.handle.write().unwrap();
      let state = h.status();
      if state.is_stopped() {
        // Store the waker so we can be woken up when resumed
        h.store_waker(cx.waker().clone());
        return Poll::Pending;
      }

      if !state.is_in_progress() {
        return Poll::Ready(None);
      }
    }

    let p = self.project();

    p.stream.poll_next(cx).map(|opt| {
      let mut h = p.handle.write().unwrap();
      if let Some(item) = &opt {
        h.report_progress(cx, item.unit_size());
      } else if *p.complete_on_end {
        h.mark_completed();
      }
      opt
    })
  }
}

impl<M, U, S, P> FusedStream for ProgressStream<M, U, S, P>
where
  M: Stream<Item = U>,
  U: Unit,
  S: Sink,
  P: Clone + Serialize + for<'de> Deserialize<'de>,
{
  fn is_terminated(&self) -> bool {
    self.handle.read().unwrap().status().is_terminated()
  }
}
