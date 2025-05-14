module ProjectsController

using Genie, Genie.Renderer.Json, Genie.Router
using SearchLight
using Projects

function index()
  json(SearchLight.all(Project))
end

function create()
  project = Project(
    name = params(:name),
    description = params(:description),
    start_date = DateTime(params(:start_date, now())),
    end_date = params(:end_date) !== nothing ? DateTime(params(:end_date)) : nothing
  )
  
  if SearchLight.save!(project)
    json(project)
  else
    json(Dict(:error => "Failed to create project"), 422)
  end
end

function routes()
  route("/api/projects", index, method=GET)
  route("/api/projects", create, method=POST)
end

end