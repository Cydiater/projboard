class ProjectsController < ApplicationController
  skip_before_action :authenticate_user, only: %i[list_all index show]
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

  def update
    @user = User.find(params[:user_id])
    if @current_user.id == params[:user_id].to_i
      @project = @user.projects.update(project_params)
      head :ok
    else
      head :unauthorized
    end
  end

  def show
    @project = Project.find(params[:id])
    render json: {
      title: @project.title,
      info: @project.info,
      project_id: @project.id,
      user_id: @project.user.id,
      user_name: @project.user.name,
      user_is_student: @project.user.is_student
    }
  end

  def destroy
    @user = User.find(params[:user_id])
    @project = @user.projects.find(params[:id])
    @project.destroy
    head :ok
  end

  def index
    @user = User.find(params[:user_id])
    if @user.is_student
      x = Project
          .joins(:user)
          .left_outer_joins(:attentions)
          .select("users.id as user_id,
                projects.id as project_id,
                users.name as user_name,
                projects.title as title,
                projects.info as info,
                MAX(CASE WHEN attentions.user_id = #{@user.id} THEN attentions.id ELSE null END) as attention_id,
                COUNT(attentions.id) as attention_count,
                projects.created_at as project_created_at")
          .group('projects.id')
          .order(:project_created_at)
          .reverse_order
      render json: x.joins(:attentions).where("attentions.user_id = #{@user.id}")
    else
      render json: Project
        .joins(:user)
        .left_outer_joins(:attentions)
        .select("users.id as user_id,
              projects.id as project_id,
              users.name as user_name,
              projects.title as title,
              projects.info as info,
              MAX(CASE WHEN attentions.user_id = #{@user.id} THEN attentions.id ELSE null END) as attention_id,
              COUNT(attentions.id) as attention_count,
              projects.created_at as project_created_at")
        .group('projects.id')
        .order(:project_created_at)
        .where(user_id: @user.id)
        .reverse_order
    end
  end

  def list_all
    if params[:user_id].present?
      uid = params[:user_id].to_i
      render json: Project
        .joins(:user)
        .left_outer_joins(:attentions)
        .select("users.id as user_id,
              projects.id as project_id,
              users.name as user_name,
              projects.title as title,
              projects.info as info,
              MAX(CASE WHEN attentions.user_id = #{uid} THEN attentions.id ELSE null END) as attention_id,
              COUNT(attentions.id) as attention_count,
              projects.created_at as project_created_at")
        .group('projects.id')
        .order(:project_created_at)
        .reverse_order
    else
      render json: Project
        .joins(:user)
        .left_outer_joins(:attentions)
        .select("users.id as user_id,
              projects.id as project_id,
              users.name as user_name,
              projects.title as title,
              projects.info as info,
              COUNT(attentions.id) as attention_count,
              projects.created_at as project_created_at")
        .group('projects.id')
        .order(:project_created_at)
        .reverse_order
    end
  end

  private

  def project_params
    params.require(:project).permit(:title, :info)
  end
end
