class User < ApplicationRecord
  has_secure_password
  has_many :projects, dependent: :destroy
  has_many :discussions, dependent: :destroy
  has_many :attentions, dependent: :destroy

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
