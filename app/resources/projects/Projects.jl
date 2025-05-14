module Projects

using SearchLight
using SearchLight.Validation

export Project

Base.@kwdef mutable struct Project <: SearchLight.AbstractModel
  id::SearchLight.DbId = SearchLight.DbId()
  name::String = ""
  description::String = ""
  start_date::DateTime = now()
  end_date::Union{DateTime, Nothing} = nothing
  created_at::DateTime = now()
  updated_at::DateTime = now()
end

function SearchLight.Validation.validate(project::Project)
  ValidationResult(
    isempty(project.name) ? [ValidationError("Project name cannot be empty")] : []
  )
end

end