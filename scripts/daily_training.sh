#!/bin/bash
# Daily Training Job - Midnight and Noon
# Telemetry Analytics + Bi Dashboard Reporting

echo "$(date): Starting daily training job" >> /var/log/picmob_training.log

cd /Users/pounds_1/dev/PicMob-beta

# Run training
python3 scripts/train_models.py >> /var/log/picmob_training.log 2>&1

# Send telemetry summary
curl -X POST https://picmob-api.workers.dev/api/telemetry/report \
  -H "Content-Type: application/json" \
  -d '{"report": "daily", "timestamp": '$(date +%s)'}'

echo "$(date): Training complete" >> /var/log/picmob_training.log
