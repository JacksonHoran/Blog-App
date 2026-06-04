<!-- File: templates/Articles/add.php -->
<?php
/**
 * @var \App\Model\Entity\Article $article
 */
?>
<h1>Add Article</h1>
<?php
    echo $this->Form->create($article);
    echo $this->Form->control('title');
    echo $this->Form->control('body', ['rows' => '3']);
    echo $this->Form->button(__('Save Article'));
    echo $this->Form->end();
?>