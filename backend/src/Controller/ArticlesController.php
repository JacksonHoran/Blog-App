<?php
declare(strict_types=1);

namespace App\Controller;

/**
 * Articles Controller
 *
 * @property \App\Model\Table\ArticlesTable $Articles
 */
class ArticlesController extends AppController
{
    /**
     * Index method
     *
     * @return \Cake\Http\Response|null|void Renders view
     */
    public function index()
    {
        $this->Authorization->skipAuthorization();

        $query = $this->Articles->find()
            ->contain(['Users']);
        $articles = $this->paginate($query);

        $this->set(compact('articles'));
    }

    /**
     * View method
     *
     * @param string|null $slug Article slug.
     * @return \Cake\Http\Response|null|void Renders view
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function view($slug = null)
    {
        $this->Authorization->skipAuthorization();

        // Update retrieving tags with contain()
        $article = $this->Articles
            ->findBySlug($slug)
            ->firstOrFail();
        $this->set(compact('article'));
    }


    /**
     * Add method
     *
     * @return \Cake\Http\Response|null|void Redirects on successful add, renders view otherwise.
     */
 // in src/Controller/ArticlesController.php
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
                    'message' => 'Article successfull;y created.',
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

    /**
     * Edit method
     *
     * @param string|null $slug Article slug.
     * @return \Cake\Http\Response|null|void Redirects on successful edit, renders view otherwise.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function edit($slug)
    {
        $article = $this->Articles
            ->findBySlug($slug)
            ->firstOrFail();
        $this->Authorization->authorize($article);

        if ($this->request->is(['post', 'put'])) {
            $this->Articles->patchEntity($article, $this->request->getData(), [
                // Added: Disable modification of user_id.
                'accessibleFields' => ['user_id' => false],
            ]);
            if ($this->Articles->save($article)) {
                $this->Flash->success(__('Your article has been updated.'));

                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('Unable to add your article.'));
        }
        $this->set(compact('article'));
    }

    /**
     * Delete method
     *
     * @param string|null $slug Article id.
     * @throws \Cake\Datasource\Exception\RecordNotFoundException When record not found.
     */
    public function delete(?string $slug)
    {
        $this->request->allowMethod(['post', 'delete']);
        $article = $this->Articles->findBySlug($slug)->firstOrFail();
        $this->Authorization->authorize($article);

        $article = $this->Articles->findBySlug($slug)->firstOrFail();
        if ($this->Articles->delete($article)) {
            $this->Flash->success(__('The {0} article has been deleted.', $article->title));

            return $this->redirect(['action' => 'index']);
        }
    }
}
