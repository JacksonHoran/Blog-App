<?php
declare(strict_types=1);

use Migrations\BaseMigration;

class CreateArticlesTags extends BaseMigration
{
    public bool $autoId = false;

    /**
     * Change Method.
     *
     * More information on this method is available here:
     * https://book.cakephp.org/migrations/5/guides/writing-migrations/migration-methods.html#the-change-method
     *
     * @return void
     */
public function change()
    {
        $table = $this->table('articles_tags', [
            'id' => false,
            'primary_key' => ['article_id', 'tag_id']
        ]);

        $table->addColumn('article_id', 'integer', [
            'default' => null,
            'null' => false,
        ]);
        $table->addColumn('tag_id', 'integer', [
            'default' => null,
            'null' => false,
        ]);
        $table->addColumn('created', 'datetime', [
            'default' => null,
            'null' => false,
        ]);
        $table->addColumn('modified', 'datetime', [
            'default' => null,
            'null' => false,
        ]);
        
        $table->create();
    }
}
