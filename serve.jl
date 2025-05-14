using Genie
using Genie.Router
using Genie.Renderer.Html

# Configure the app
Genie.config.server_host = "127.0.0.1"
Genie.config.server_port = 8000
# Fix: Use Logging.LogLevel instead of a symbol
using Logging
Genie.config.log_level = Logging.Debug  # Instead of :debug

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