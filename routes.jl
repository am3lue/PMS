using Genie.Router
using Genie.Renderer.Json
using Genie.Requests
using CSV
using DataFrames
using SHA
using Base64

const CREDENTIALS_FILE = "peoples.csv"

# Function to load credentials from the CSV file
function load_credentials()
    if isfile(CREDENTIALS_FILE)
        return CSV.read(CREDENTIALS_FILE, DataFrame)
    else
        # Create the file with headers if it doesn't exist
        df = DataFrame(firstName=String[], lastName=String[], email=String[], passwordHash=String[], termsAccepted=Bool[])
        CSV.write(CREDENTIALS_FILE, df)
        return df
    end
end

# Function to save credentials to the CSV file
function save_credentials(df::DataFrame)
    CSV.write(CREDENTIALS_FILE, df)
end

# Function to hash passwords using SHA-256 and Base64 encode the result
function hash_password(password::AbstractString)
    sha_bytes = sha256(password)
    return base64encode(sha_bytes)
end

# Function to validate email format (simple regex)
function is_valid_email(email::AbstractString)
    return occursin(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$", email)
end

# Route to serve the welcome page
route("/") do
    serve_static_file("welcome.html")
end

# Route to serve the signup page
route("/signup", method=GET) do
    serve_static_file("signup.html")
end

# Route to serve the login page
route("/login", method=GET) do
    serve_static_file("login.html")
end

# Route to handle user signup
route("/signup", method=POST) do
    payload = Requests.postpayload()

    firstName = strip(get(payload, "firstName", ""))
    lastName = strip(get(payload, "lastName", ""))
    email = strip(get(payload, "email", ""))
    password = get(payload, "password", "")
    termsAccepted = get(payload, "terms", "false") == "on"

    # Validate required fields
    if isempty(firstName) || isempty(lastName) || isempty(email) || isempty(password)
        return json(Dict("status" => "error", "message" => "All fields are required."))
    end

    # Validate email format
    if !is_valid_email(email)
        return json(Dict("status" => "error", "message" => "Invalid email format."))
    end

    # Check terms acceptance
    if !termsAccepted
        return json(Dict("status" => "error", "message" => "You must accept the terms and conditions."))
    end

    df = load_credentials()

    # Check if email already registered (case insensitive)
    if any(lowercase.(df.email) .== lowercase(email))
        return json(Dict("status" => "error", "message" => "Email already registered."))
    end

    # Hash the password before storing
    passwordHash = hash_password(password)

    new_user = DataFrame(
        firstName = [firstName],
        lastName = [lastName],
        email = [email],
        passwordHash = [passwordHash],
        termsAccepted = [termsAccepted]
    )

    df = vcat(df, new_user)
    save_credentials(df)

    return json(Dict("status" => "success", "message" => "Signup successful."))
end

# Route to handle user login
route("/login", method=POST) do
    # Try to parse JSON payload, fallback to form payload
    payload = try
        Requests.jsonpayload()
    catch
        Requests.postpayload()
    end

    email = strip(get(payload, "email", ""))
    password = get(payload, "password", "")

    # Validate required fields
    if isempty(email) || isempty(password)
        return json(Dict("status" => "error", "message" => "Email and password are required."))
    end

    df = load_credentials()

    # Hash the provided password to compare
    passwordHash = hash_password(password)

    # Find user with matching email and password hash (case insensitive email)
    user_row = findfirst(row -> lowercase(row.email) == lowercase(email) && row.passwordHash == passwordHash, eachrow(df))

    if user_row !== nothing
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
