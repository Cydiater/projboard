class User < ApplicationRecord
  has_secure_password
  validates :name, presence: true, uniqueness: true, length: {
    minimum: 3,
    maximum: 20
  }
  validates :password, presence: true, length: {
    minimum: 8,
    maximum: 40
  }
  validates :is_student, inclusion: { in: [true, false] }
end
