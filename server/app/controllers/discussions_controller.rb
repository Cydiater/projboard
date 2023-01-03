class DiscussionsController < ApplicationController
  skip_before_action :authenticate_user, only: [:index]
  protect_from_forgery with: :null_session

  def index
    @user = User.find(params[:user_id])
    if params[:project_id].present?
      @project = @user.projects.find(params[:project_id])
      render json: @project.discussions.joins(:user)
        .select("users.id as user_id, discussions.content as content, discussions.created_at as created_at, users.name as user_name, users.is_student as user_is_student, discussions.id as id")
    else
      render json: @user.disccusions.all
    end
  end

  def create
    if params[:user_id].to_i != @current_user.id
      head :unauthorized
    end
    @user = User.find(params[:user_id])
    @user.discussions.create(discussion_params)
    head :ok
  end

  def destroy
    if params[:user_id].to_i != @current_user.id
      head :unauthorized
    end
    @user = User.find(params[:user_id])
    @discussion = @user.discussions.find(params[:id])
    @discussion.destroy
    head :ok
  end

  private

  def discussion_params
    params.require(:discussion).permit(:content, :project_id)
  end
end
