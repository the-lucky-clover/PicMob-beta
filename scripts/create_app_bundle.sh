#!/bin/bash
# Bundle PyTorch into PicMob standalone app
# Creates a self-contained app with ML capabilities

echo "Creating PyTorch bundle..."

# Create bundle directory
mkdir -p /Users/pounds_1/dev/PicMob-beta/app_bundle/lib

# Install PyTorch for standalone use
pip3 install torch torchvision --target=/Users/pounds_1/dev/PicMob-beta/app_bundle/lib

# Copy training script
cp /Users/pounds_1/dev/PicMob-beta/scripts/train_models.py /Users/pounds_1/dev/PicMob-beta/app_bundle/

# Create launcher
cat > /Users/pounds_1/dev/PicMob-beta/app_bundle/run_training.py << 'PYEND'
#!/usr/bin/env python3
import sys
import os
sys.path.insert(0, '/Applications/PicMob.app/Contents/Resources/lib')
os.chdir('/Applications/PicMob.app/Contents/Resources/')

# Run training
exec(open('train_models.py').read())
PYEND

echo "Bundle created at /Users/pounds_1/dev/PicMob-beta/app_bundle/"
