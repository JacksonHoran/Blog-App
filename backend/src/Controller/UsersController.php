<?php
declare(strict_types=1);

namespace App\Controller;

class UsersController extends AppController
{
    public function index()
    {
        $query = $this->Users->find();
        $users = $this->paginate($query);

        $this->set(compact('users'));
    }

    public function view($id = null)
    {
        $this->request->allowMethod(['GET']);
        $this->Authorization->skipAuthorization();
        $user = $this->Users->get($id);
        return $this->response
            ->withType('application/json')
            ->withStatus(200)
            ->withStringBody(json_encode([
                'message' => 'User successfully retrieved.',
                'user' => $user
            ]));
    }

    public function add()
    {
        $this->request->allowMethod(['POST']);
        $this->Authorization->skipAuthorization();
        $user = $this->Users->newEmptyEntity();
        $user = $this->Users->patchEntity($user, $this->request->getData());
        if ($this->Users->save($user)) {
            return $this->response
                ->withType('application/json')
                ->withStatus(201)
                ->withStringBody(json_encode([
                    'message' => 'New user successfully created.',
                    'user' => $user
                ]));
        }

        return $this-> response
            ->withType('application/json')
            ->withStatus(422)
            ->withStringBody(json_encode([
                'message' => 'Failed to save user. Please check your inputs.',
                'errors' => $user->getErrors()
            ]));
    }

    public function edit($id = null)
    {
        $user = $this->Users->get($id, contain: []);
        if ($this->request->is(['patch', 'post', 'put'])) {
            $user = $this->Users->patchEntity($user, $this->request->getData());
            if ($this->Users->save($user)) {
                $this->Flash->success(__('The user has been saved.'));

                return $this->redirect(['action' => 'index']);
            }
            $this->Flash->error(__('The user could not be saved. Please, try again.'));
        }
        $this->set(compact('user'));
    }

    public function delete($id = null)
    {
        $this->request->allowMethod(['post', 'delete']);
        $user = $this->Users->get($id);
        if ($this->Users->delete($user)) {
            $this->Flash->success(__('The user has been deleted.'));
        } else {
            $this->Flash->error(__('The user could not be deleted. Please, try again.'));
        }

        return $this->redirect(['action' => 'index']);
    }

    public function beforeFilter(\Cake\Event\EventInterface $event): void
    {
        parent::beforeFilter($event);
        $this->Authentication->allowUnauthenticated(['login', 'add']);
    }

    public function login()
    {
        $this->request->allowMethod(['POST']);
        $this->Authorization->skipAuthorization();
        $result = $this->Authentication->getResult();

        if ($result && $result->isValid()) {
            $user = $result->getData();

            return $this->response
                ->withType('application/json')
                ->withStatus(200)
                ->withStringBody(json_encode([
                    'message' => 'Login successful',
                    'user' => $user
                ]));
        }

        return $this->response
            ->withType('application/json')
            ->withStatus(401)
            ->withStringBody(json_encode([
                'message' => 'Invalid email or password'
            ]));
    }

    public function logout()
    {
        $this->request->allowMethod(['POST']);
        $this->Authentication->logout();
        $this->Authorization->skipAuthorization();
        return $this->response
            ->withType('application/json')
            ->withStatus(200)
            ->withStringBody(json_encode([
                'message' => 'Logout successful'
            ]));
    }
}
