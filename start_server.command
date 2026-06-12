#!/bin/bash
cd "$(dirname "$0")"
echo "افتح الرابط التالي في المتصفح:"
echo "http://localhost:8000"
python3 -m http.server 8000
