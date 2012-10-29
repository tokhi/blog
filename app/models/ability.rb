class Ability < ActiveRecord::Base
# in Ability#initialize
if user.role? :moderator
  can :manage, Post
end
if user.role? :admin
  can :manage, Thread
end
if user.role? :superadmin
  can :manage, Forum
end

end
