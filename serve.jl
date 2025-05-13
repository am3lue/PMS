using Genie
using Pkg
using Sockets

ip_address = string(Sockets.getipaddr())

# Clear screen
println("\033c")

# Activate the environment
Pkg.activate(".")

# Load the application
try
    println("Loading application...")
    Genie.loadapp()
    
    # Configure server settings
    Genie.config.run_as_server = true
    Genie.config.server_port = 8000
    Genie.config.server_host = ip_address
    Genie.config.cors_headers["Access-Control-Allow-Origin"] = "*"
    Genie.config.cors_headers["Access-Control-Allow-Headers"] = "Content-Type"
    Genie.config.cors_headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    
    # Get local IP addresses
    local_ips = getipaddrs()
    println("\nAvailable IP addresses:")
    for ip in local_ips
        if !startswith(string(ip), "127.") && !startswith(string(ip), "::")
            println("  - http://$ip:$(Genie.config.server_port)")
        end
    end

    # Clear screen
    println("\033c")
    println("""
    
    Starting 3lue Library server...
    Server running at http://$(Genie.config.server_host):$(Genie.config.server_port)
    Press Ctrl+C to stop the server
    """)
    
    # Start the server
    up()
catch e
    println("Error starting server: $(string(e))")
    println("Stacktrace:")
    showerror(stdout, e)
    exit(1)
end