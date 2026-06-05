<?php
declare(strict_types=1);

namespace App\Controller;

use Cake\Http\Response;

class ArticlesController extends AppController
{
    public function index()
    {
        $this->request->allowMethod(['GET']);
        $this->Authorization->skipAuthorization();
        $articles = $this->paginate($this->Articles);
        return $this->response
            ->withType('application/json')
            ->withStatus(200)
            ->withStringBody(json_encode([
                'articles' => $articles
            ]));
    }

    public function view($id = null)
    {
        $this->request->allowMethoid(['GET']);
        $this->Authorization->skipAuthorization();
        $article = $this->Articles->get($id);
        return $this->response
            ->withType('application/json')
            ->withStatus(200)
            ->withStringBody(json_encode([
                'message' => 'Article successfully retrieved.',
                'article' => $article
            ]));
    }

    public function add()
    {
        $this->request->allowMethod(['POST']);
        $article = $this->Articles->newEmptyEntity();
        $article = $this->Articles->patchEntity($article, $this->request->getData());
        $user = $this->request->getAttribute('identity');
        $article->user_id = $user->$user->getIdentifier();

        if ($this->Articles->save($article)) {
            return $this->response
                ->withType('application/json')
                ->withStatus(201)
                ->withStringbody(json_encode([
                    'message' => 'Article successfully created.',
                    'article' => $article
                ]));
        }

        return $this->response
            ->withType('application/json')
            ->withStatus(422)
            ->withStringBody(json_encode([
                'message' => 'Failed to save article. Please check your inputs.',
                'errors' => $article->getErrors()
            ]));
    }

    public function edit($id = null)
    {
        $this->request->allowMethod(['PATCH']);
        $article = $this->Articles->get($id);
        $this->Authorization->authorize($article);
        $article = $this->Articles->patchEntity($article, $this->request->getData());
        if ($this->Articles->save($article)) {
            return $this->response
                ->withType('application/json')
                ->withStatus(200)
                ->withStringBody(json_encode([
                    'message' => 'Article successfully updated.',
                    'article' => $article
                ]));
        }

        return $this->response
            ->withType('application/json')
            ->withStatus(422)
            ->withStringBody(json_encode([
                'message' => 'Failed to update article.',
                'errors' => $article->getErrors()
            ]));
    }
   
    public function delete($id = null)
    {
        $this->request->allowMethod(['DELETE']);
        $article = $this->Articles->get($id);
        $this->Authorization->authorize($article);

        if ($this->Articles->delete($article)) {
            return $this->response
                ->withType('application/json')
                ->withStatus(200)
                ->withStringBody(json_encode([
                    'message' => 'Article successfully deleted.'
                ]));
        }

        return $this->response
            ->withType('application/json')
            ->withStatus(500)
            ->withStringBody(json_encode([
                'message' => 'Failed to delete article.'
            ]));
    }
}
