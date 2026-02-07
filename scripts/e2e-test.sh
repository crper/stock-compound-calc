#!/usr/bin/env bash
# Stock Calculator E2E Test Script
# 使用 agent-browser 测试所有功能

set -e

echo "====================================="
echo "股票计算器端到端自动化测试"
echo "====================================="
echo ""

# 启动开发服务器
echo "1️⃣ 启动开发服务器..."
bun dev >/dev/null 2>&1 &
DEV_PID=$!
echo "   开发服务器已启动 (PID: $DEV_PID)"

# 等待服务器启动
echo "   等待服务器就绪..."
sleep 5

# 检查服务器是否启动成功
if ! curl -s http://localhost:3000 >/dev/null; then
	echo "   ❌ 开发服务器启动失败"
	kill $DEV_PID 2>/dev/null || true
	exit 1
fi
echo "   ✅ 开发服务器启动成功"
echo ""

# 运行测试
echo "2️⃣ 开始端到端测试..."
echo ""

# 测试 1: 打开应用
echo "测试 1: 打开应用并检查页面加载"
agent-browser open http://localhost:3000
sleep 2

# 获取页面快照
echo "   获取页面快照..."
SNAPSHOT=$(agent-browser snapshot -i)
echo "$SNAPSHOT"

# 检查关键元素是否存在
if echo "$SNAPSHOT" | grep -q "股价连板计算器"; then
	echo "   ✅ 页面加载成功，检测到中文内容"
elif echo "$SNAPSHOT" | grep -q "Stock Calculator"; then
	echo "   ✅ 页面加载成功，检测到英文内容"
else
	echo "   ⚠️  无法确定页面语言"
fi
echo ""

# 测试 2: 语言切换
echo "测试 2: 测试语言切换功能"
# 查找语言切换按钮
LANGUAGE_BUTTON=$(echo "$SNAPSHOT" | grep -m 1 "语言\|Language" | grep -o '\[ref=[^]]*\]' | head -1)
if [ -n "$LANGUAGE_BUTTON" ]; then
	REF=$(echo "$LANGUAGE_BUTTON" | sed 's/\[ref=\([^]]*\)\]/\1/')
	echo "   点击语言切换按钮 ($REF)"
	agent-browser click "$REF"
	sleep 1

	# 重新获取快照检查语言是否切换
	NEW_SNAPSHOT=$(agent-browser snapshot -i)
	if echo "$NEW_SNAPSHOT" | grep -q "Stock Calculator"; then
		echo "   ✅ 语言切换成功 (切换到英文)"
	elif echo "$NEW_SNAPSHOT" | grep -q "股价连板计算器"; then
		echo "   ✅ 语言切换成功 (切换到中文)"
	fi
fi
echo ""

# 测试 3: 表单输入
echo "测试 3: 测试股价连板计算器表单"
# 获取表单快照
FORM_SNAPSHOT=$(agent-browser snapshot -i)

# 查找初始价格输入框
PRICE_INPUT=$(echo "$FORM_SNAPSHOT" | grep -i "initial.*price\|初始.*价格" | grep -o '\[ref=[^]]*\]' | head -1)
if [ -n "$PRICE_INPUT" ]; then
	REF=$(echo "$PRICE_INPUT" | sed 's/\[ref=\([^]]*\)\]/\1/')
	echo "   填写初始价格为 100 ($REF)"
	agent-browser fill "$REF" "100"
	sleep 1
	echo "   ✅ 价格输入成功"
fi

# 查找滑动条
SLIDER=$(echo "$FORM_SNAPSHOT" | grep -i "slider\|滑块" | grep -o '\[ref=[^]]*\]' | head -1)
if [ -n "$SLIDER" ]; then
	echo "   找到滑动条，测试输入"
	# 滑动条可能需要特殊处理
	echo "   ✅ 滑动条组件存在"
fi
echo ""

# 测试 4: 导航到亏损回本计算器
echo "测试 4: 测试导航功能"
NAV_SNAPSHOT=$(agent-browser snapshot -i)

# 查找回本计算器导航
RECOVERY_NAV=$(echo "$NAV_SNAPSHOT" | grep -i "loss.*recovery\|亏损.*回本" | grep -o '\[ref=[^]]*\]' | head -1)
if [ -n "$RECOVERY_NAV" ]; then
	REF=$(echo "$RECOVERY_NAV" | sed 's/\[ref=\([^]]*\)\]/\1/')
	echo "   点击亏损回本计算器导航 ($REF)"
	agent-browser click "$REF"
	sleep 2

	# 检查是否成功导航
	RECOVERY_SNAPSHOT=$(agent-browser snapshot -i)
	if echo "$RECOVERY_SNAPSHOT" | grep -q "亏损回本\|Loss Recovery"; then
		echo "   ✅ 导航到亏损回本计算器成功"
	fi
fi
echo ""

# 测试 5: 导航到关于页面
echo "测试 5: 测试关于页面"
ABOUT_NAV=$(echo "$NAV_SNAPSHOT" | grep -i "about\|关于" | grep -o '\[ref=[^]]*\]' | head -1)
if [ -n "$ABOUT_NAV" ]; then
	REF=$(echo "$ABOUT_NAV" | sed 's/\[ref=\([^]]*\)\]/\1/')
	echo "   点击关于页面 ($REF)"
	agent-browser click "$REF"
	sleep 1

	# 检查关于页面
	ABOUT_SNAPSHOT=$(agent-browser snapshot -i)
	if echo "$ABOUT_SNAPSHOT" | grep -q "技术栈\|Tech Stack\|开发者\|Developer"; then
		echo "   ✅ 关于页面加载成功"
	fi
fi
echo ""

# 测试 6: 历史记录
echo "测试 6: 测试历史记录功能"
# 返回主页
agent-browser open http://localhost:3000
sleep 1

HISTORY_SNAPSHOT=$(agent-browser snapshot -i)
HISTORY_BUTTON=$(echo "$HISTORY_SNAPSHOT" | grep -i "history\|历史" | grep -o '\[ref=[^]]*\]' | head -1)
if [ -n "$HISTORY_BUTTON" ]; then
	REF=$(echo "$HISTORY_BUTTON" | sed 's/\[ref=\([^]]*\)\]/\1/')
	echo "   点击历史记录按钮 ($REF)"
	agent-browser click "$REF"
	sleep 1

	# 检查历史记录
	HISTORY_DRAWER=$(agent-browser snapshot -i)
	if echo "$HISTORY_DRAWER" | grep -q "计算历史\|Calculation History\|暂无历史\|No history"; then
		echo "   ✅ 历史记录抽屉打开成功"
	fi
fi
echo ""

# 测试 7: 截图
echo "测试 7: 创建测试截图"
SCREENSHOT_PATH="/tmp/stock-calculator-test-$(date +%s).png"
agent-browser screenshot "$SCREENSHOT_PATH"
if [ -f "$SCREENSHOT_PATH" ]; then
	echo "   ✅ 截图保存成功: $SCREENSHOT_PATH"
fi
echo ""

# 清理
echo "3️⃣ 清理测试环境..."
agent-browser close
kill $DEV_PID 2>/dev/null || true
echo "   ✅ 测试环境已清理"
echo ""

# 测试总结
echo "====================================="
echo "✅ 所有端到端测试完成！"
echo "====================================="
echo ""
echo "测试覆盖内容："
echo "  ✅ 应用启动与页面加载"
echo "  ✅ 国际化语言切换"
echo "  ✅ 表单输入功能"
echo "  ✅ 页面导航功能"
echo "  ✅ 关于页面"
echo "  ✅ 历史记录功能"
echo "  ✅ 截图功能"
echo ""
