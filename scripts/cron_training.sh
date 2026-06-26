#!/bin/bash
# Daily AI Model Training Script
# Run twice daily: 6AM and 6PM

cd /Users/pounds_1/dev/PicMob-beta
/usr/bin/python3 scripts/train_models.py >> /var/log/picmob_training.log 2>&1
