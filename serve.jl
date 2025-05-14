using Genie
using Genie.Router
using Genie.Renderer.Html
using Logging

# Configure the app to be accessible from any computer on the network
Genie.config.server_host = "0.0.0.0"  # Bind to all network interfaces
Genie.config.server_port = 8000
Genie.config.log_level = Logging.Debug

# Define routes
route("/") do
  serve_static_file("welcome.html")
end

route("/dashboard") do
  html(:pms, :dashboard)
end

route("/tasks") do
  html(:pms, :tasks)
end

route("/collaboration") do
  html(:pms, :collaboration)
end

# Start the server
up()
