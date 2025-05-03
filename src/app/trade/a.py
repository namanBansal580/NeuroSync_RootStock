from tradingview_websocket import TradingViewWebSocket

# Define the symbol and timeframe
symbol = "USDEUR"
timeframe = "1"

# Initialize the WebSocket client
ws = TradingViewWebSocket(symbol, timeframe,100)

# Connect to the WebSocket
ws.connect()

# Run the WebSocket client
ws.run()

# Access the real-time data
while True:
    if ws.result_data:
        latest_data = ws.result_data[-1]  # Get the latest data point
        print(latest_data)
