class AttentionsController < ApplicationController
  protect_from_forgery with: :null_session
  skip_before_action :authenticate_user, only: [:index]

  def index
    @user = User.find(params[:user_id])
    render json: @user.attentions
  end

  def create
    @user = User.find(params[:user_id])
    if @user.id != @current_user.id
      head :unauthorized
    end
    @user.attentions.create(attention_params)
    head :ok
  end

  def destroy
    @user = User.find(params[:user_id])
    if @user.id != @current_user.id
      head :unauthorized
    end
    @attention = @user.attentions.find(params[:id])
    @attention.destroy
    head :ok
  end

  private

  def attention_params
    params.require(:attention).permit(:project_id)
  end
end
