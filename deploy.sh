#!/bin/bash
set -e

echo "==> 检查 Vercel CLI..."
if ! command -v vercel &> /dev/null; then
  echo "未检测到 vercel，正在安装..."
  npm install -g vercel
fi

echo "==> 构建检查..."
npm run build

echo "==> 部署到 Vercel..."
vercel --prod
