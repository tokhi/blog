class CommentObserver < ActiveRecord::Observer
	def after_create(comment)
		#puts "We will notify the author later on.."
		Notifier.comment_added(comment).deliver
	end
end
