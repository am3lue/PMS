module Tasks

using SearchLight, SearchLight.Validation, Dates
import Base: @kwdef

export Task

@kwdef mutable struct Task <: SearchLight.AbstractModel
  id::DbId = DbId()
  project_id::DbId = DbId()
  title::String = ""
  description::String = ""
  status::String = "pending"
  assigned_to::Union{String, Nothing} = nothing
  due_date::Union{DateTime, Nothing} = nothing
  created_at::DateTime = Dates.now()
  updated_at::DateTime = Dates.now()
end

end