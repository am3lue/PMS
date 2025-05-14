using Genie.Router
using Genie.Renderer.Json
using Genie.Requests
using CSV
using DataFrames

const CREDENTIALS_FILE = "peoples.csv"

# Function to load credentials from the CSV file
function load_credentials()
    if isfile(CREDENTIALS_FILE)
        return CSV.read(CREDENTIALS_FILE, DataFrame)
    else
        # Create the file with headers if it doesn't exist
        df = DataFrame(firstName=String[], lastName=String[], email=String[], password=String[], termsAccepted=Bool[])
        CSV.write(CREDENTIALS_FILE, df)
        return df
    end
end

# Function to save credentials to the CSV file
function save_credentials(df::DataFrame)
    CSV.write(CREDENTIALS_FILE, df)
end

# Route to serve the welcome page
route("/") do
    serve_static_file("welcome.html")
end

# Route to handle user signup
route("/signup", method=POST) do
    # Alternative way to retrieve parameters using Genie.Requests.postpayload()
    payload = Requests.postpayload()
    
    firstName = get(payload, "firstName", "")
    lastName = get(payload, "lastName", "")
    email = get(payload, "email", "")
    password = get(payload, "password", "")
    termsAccepted = get(payload, "terms", "false") == "on" ? true : false

    if isempty(email) || isempty(password) || isempty(firstName) || isempty(lastName)
        return json(Dict("status" => "error", "message" => "All fields are required."))
    end

    if !termsAccepted
        return json(Dict("status" => "error", "message" => "You must accept the terms and conditions."))
    end

    df = load_credentials()
    if email in df.email
        return json(Dict("status" => "error", "message" => "Email already registered."))
    else
        new_user = DataFrame(firstName=[firstName], lastName=[lastName], email=[email], password=[password], termsAccepted=[termsAccepted])
        df = vcat(df, new_user)
        save_credentials(df)
        return json(Dict("status" => "success", "message" => "Signup successful."))
    end
end

# Route to handle user login
route("/login", method=POST) do
    # Alternative way to retrieve parameters using Genie.Requests.jsonpayload()
    # This assumes the client is sending JSON data. If not, use postpayload() instead
    payload = try
        Requests.jsonpayload()
    catch
        Requests.postpayload()
    end
    
    email = get(payload, "email", "")
    password = get(payload, "password", "")
    remember = get(payload, "remember", false)

    if isempty(email) || isempty(password)
        return json(Dict("status" => "error", "message" => "Email and password are required."))
    end

    df = load_credentials()
    user_row = findfirst(row -> row.email == email && row.password == password, eachrow(df))
    if user_row !== nothing
        # Could implement session management here for the remember me functionality
        user = df[user_row, :]
        return json(Dict(
            "status" => "success", 
            "message" => "Login successful.",
            "user" => Dict(
                "firstName" => user.firstName,
                "lastName" => user.lastName,
                "email" => user.email
            )
        ))
    else
        return json(Dict("status" => "error", "message" => "Invalid email or password."))
    end
end

# Route to serve the signup page
route("/signup", method=GET) do
    serve_static_file("signup.html")
end

# Route to serve the login page
route("/login", method=GET) do
    serve_static_file("login.html")
end
