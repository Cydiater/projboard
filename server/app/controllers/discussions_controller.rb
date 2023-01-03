class DiscussionsController < ApplicationController
  skip_before_action :authenticate_user, only: [:index]
  def index
    @user = User.find(params[:user_id])
    if params[:project_id].present?
      @project = @user.projects.find(params[:project_id])
      render json: @project.discussions.all
    else
      redner json: @user.disccusions.all
    end
  end
end
