class ProjectsController < ApplicationController
  skip_before_action :authenticate_user, only: [:list_all]

  def create
    @user = User.find(project_params[:user_id])
    if @current_user.id == :user_id
      @project = @user.projects.create(project_params)
      head :ok
    else
      head :unauthorized
    end
  end

  def list_all
    render json: User.joins(:projects).select("users.id as user_id, projects.id as project_id, users.name as user_name, projects.title as title, projects.info as info, projects.created_at as project_created_at")
  end

  private

  def project_params
    params.require(:project).permit(:title, :info, :user_id)
  end
end
