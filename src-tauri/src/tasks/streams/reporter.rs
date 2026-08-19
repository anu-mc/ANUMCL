use serde::{Deserialize, Serialize};
use std::time::{Duration, Instant};
use tauri::AppHandle;

use crate::tasks::streams::desc::PDesc;

pub trait Sink {
  fn report_progress(
    &self,
    task_id: u32,
    task_group: Option<&str>,
    current: i64,
    total: i64,
    percentage: u32,
    estimated_time: Option<f64>,
    speed: f64,
  );
  fn report_completion(&self, task_id: u32, task_group: Option<&str>);
  fn report_stopped(&self, task_id: u32, task_group: Option<&str>);
  fn report_cancelled(&self, task_id: u32, task_group: Option<&str>);
  fn report_started(&self, task_id: u32, task_group: Option<&str>, total: i64);
  fn report_failed(&self, task_id: u32, task_group: Option<&str>, reason: String);
}

pub struct Reporter<S: Sink> {
  total: i64,
  last_reported: i64,
  last_report_at: Instant,
  smoothed_speed: f64,
  interval: Duration,
  sink: S,
}

impl<S> Reporter<S>
where
  S: Sink,
{
  pub fn new(total: i64, interval: Duration, sink: S) -> Self {
    Self {
      total,
      last_reported: 0,
      last_report_at: Instant::now(),
      smoothed_speed: 0.0,
      interval,
      sink,
    }
  }

  pub fn set_total(&mut self, total: i64) {
    self.total = total;
  }

  pub fn reset_progress(&mut self) {
    self.last_reported = 0;
    self.last_report_at = Instant::now();
    self.smoothed_speed = 0.0;
  }

  pub fn from_desc_interval<T: Clone + Serialize + for<'de> Deserialize<'de>>(
    desc: &PDesc<T>,
    interval: &Duration,
    sink: S,
  ) -> Self {
    Self {
      total: desc.total,
      last_reported: desc.current,
      last_report_at: Instant::now(),
      smoothed_speed: 0.0,
      interval: *interval,
      sink,
    }
  }
}

impl<S> Reporter<S>
where
  S: Sink,
{
  pub fn report_started(&self, task_id: u32, task_group: Option<&str>, total: i64) {
    self.sink.report_started(task_id, task_group, total);
  }

  pub fn report_stopped(&self, task_id: u32, task_group: Option<&str>) {
    self.sink.report_stopped(task_id, task_group);
  }

  pub fn report_cancelled(&self, task_id: u32, task_group: Option<&str>) {
    self.sink.report_cancelled(task_id, task_group);
  }

  pub fn report_completion(&self, task_id: u32, task_group: Option<&str>) {
    self.sink.report_completion(task_id, task_group);
  }

  pub fn report_progress(&mut self, task_id: u32, task_group: Option<&str>, current: i64) {
    let elapsed = self
      .last_report_at
      .elapsed()
      .max(self.interval)
      .as_secs_f64();
    let percentage = if self.total > 0 {
      (current as f64 / self.total as f64 * 100.0).round() as u32
    } else {
      0
    };

    let estimated_time = if self.last_reported > 0 && current > self.last_reported {
      Some((self.total - current) as f64 / (current - self.last_reported) as f64 * elapsed)
    } else {
      None
    };

    let sample_speed = (current - self.last_reported).max(0) as f64 / elapsed;
    // Smooth bursty chunk arrivals so the UI does not report stale, peak
    // samples that make several tasks appear to exceed the link capacity.
    self.smoothed_speed = if self.smoothed_speed == 0.0 {
      sample_speed
    } else {
      self.smoothed_speed * 0.75 + sample_speed * 0.25
    };

    self.sink.report_progress(
      task_id,
      task_group,
      current,
      self.total,
      percentage,
      estimated_time,
      self.smoothed_speed,
    );

    self.last_reported = current;
    self.last_report_at = Instant::now();
  }

  pub fn report_failed(&self, task_id: u32, task_group: Option<&str>, reason: String) {
    self.sink.report_failed(task_id, task_group, reason);
  }
}

pub struct EventPayload {}

pub struct EventReporter {
  app: AppHandle,
  task_id: u32,
  total: i64,
}
