class AuthenticationController < ApplicationController
  protect_from_forgery with: :null_session
  skip_before_action :authenticate_user

  def login
    @user = User.find_by_name(params[:name])
    if @user&.authenticate(params[:password])
      token = jwt_encode({ user_id: @user.id })
      time = Time.now + 24.hours.to_i
      render json: {
        token:,
        exp: time.strftime('%m-%d-%Y %H:%M'),
        name: @user.name
      }, status: :ok
    else
      render json: {
        msg: 'Wrong username or password'
      }, status: :unauthorized
    end
  end
end