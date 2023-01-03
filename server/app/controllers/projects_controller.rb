class ProjectsController < ApplicationController
  skip_before_action :authenticate_user, only: [:list_all, :index, :show]
  protect_from_forgery with: :null_session

  def create
    @user = User.find(params[:user_id])
    if @current_user.id == params[:user_id].to_i
      @project = @user.projects.create(project_params)
      head :ok
    else
      head :unauthorized
    end
  end

  def show
    @project = Project.find(params[:id])
    render json: @project, only: %i[title info id]
  end

  def destroy
    @user = User.find(params[:user_id])
    @project = @user.projects.find(params[:id])
    @project.destroy
    head :ok
  end

  def index
    @user = User.find(params[:user_id])
    render json: User
      .where(id: params[:user_id])
      .joins(:projects)
      .select("users.id as user_id,
              projects.id as project_id,
              users.name as user_name,
              projects.title as title,
              projects.info as info,
              projects.created_at as project_created_at")
      .order(:project_created_at)
      .reverse_order
  rescue ActiveRecord::RecordNotFound => e
    render json: { msg: e.message }, status: :not_found
  end

  def list_all
    render json: User
      .joins(:projects)
      .select("users.id as user_id,
              projects.id as project_id,
              users.name as user_name,
              projects.title as title,
              projects.info as info,
              projects.created_at as project_created_at")
      .order(:project_created_at)
      .reverse_order
  end

  private

  def project_params
    params.require(:project).permit(:title, :info)
  end
end
