class UsersController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :set_user, only: [:show]
  skip_before_action :authenticate_user, only: [:create]

  def show
    render json: @user, only: %i[name is_student]
  end

  def create
    @user = User.new(user_params)
    if @user.save
      head :ok
    else
      render json: {
        msg: @user.errors.full_messages.to_sentence
      }, status: :bad_request
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :password, :is_student)
  end

  def set_user
    @user = User.find(params[:id])
  end
end
