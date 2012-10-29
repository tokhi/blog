class ArticlesController < ApplicationController
before_filter :authenticate, :except => [:index, :show, :notify_friend, :search]
def search
@articles = Article.search(params[:keyword])
render :action => 'index'
end
 
 # GET /articles
  # GET /articles.json
  def index
    @articles = Article.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @articles }
    end
  end

  # GET /articles/1
  # GET /articles/1.json
  def show
    @article = Article.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @article }
    end
  end

  # GET /articles/new
  # GET /articles/new.json
  def new
    @article = Article.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @article }
    end
  end

  # GET /articles/1/edit
  def edit
	@article = current_user.articles.find(params[:id])   
# @article = Article.find(params[:id])
  end

  # POST /articles
  # POST /articles.json
  def create
	@article = current_user.articles.new(params[:article])    
#@article = Article.new(params[:article])

    respond_to do |format|
      if @article.save
	format.html{ redirect_to(@article, "article created successfully")}
#	format.html { redirect_to(@article, :notice => t('articles.create_success')) }
        format.json { render json: @article, status: :created, location: @article }
      else
        format.html { render action: "new" }
        format.json { render json: @article.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /articles/1
  # PUT /articles/1.json
  def update
	@article = current_user.articles.find([:id])    
#@article = Article.find(params[:id])
    respond_to do |format|
      if @article.update_attributes(params[:article])
format.html { redirect_to(@article, "article updated succesfully") }
#format.html { redirect_to(@article,
#	:notice => t('articles.update_success')) }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @article.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /articles/1
  # DELETE /articles/1.json
# DELETE /articles/1
# DELETE /articles/1.xml
def destroy
@article = current_user.articles.find(params[:id])
@article.destroy
respond_to do |format|
format.html { redirect_to(articles_url) }
format.xml { head :ok }
end
end
def notify_friend
@article = Article.find(params[:id])
Notifier.email_friend(@article, params[:name], params[:email]).deliver
#redirect_to @article, :notice => t('articles.notify_friend_success')
end
end

