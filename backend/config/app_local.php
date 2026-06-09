<?php

use function Cake\Core\env;

/*
 * Local configuration file to provide any overrides to your app.php configuration.
 * Copy and save this file as app_local.php and make changes as required.
 * Note: It is not recommended to commit files with credentials such as app_local.php
 * into source code version control.
 */
return [
    /*
     * Debug Level:
     *
     * Production Mode:
     * false: No error messages, errors, or warnings shown.
     *
     * Development Mode:
     * true: Errors and warnings shown.
     */
    'debug' => filter_var(env('DEBUG', false), FILTER_VALIDATE_BOOLEAN),

    /*
     * Security and encryption configuration
     *
     * - salt - A random string used in security hashing methods.
     *   The salt value is also used as the encryption key.
     *   You should treat it as extremely sensitive data.
     */
    'Security' => [
        'salt' => env('SECURITY_SALT', '577280ebf9dc563a047ed69452b37af649ae2149e88a6a600127414bd46f4984'),
    ],

    /*
     * Connection information used by the ORM to connect
     * to your application's datastores.
     *
     * See app.php for more configuration options.
     */
    'Datasources' => [
        'default' => [
            'host' => env('DB_HOST'),
            //'port' => env('DB_PORT', null),  // uncomment + set DB_PORT for MAMP (8889), etc.

            'username' => env('DB_USERNAME'),
            'password' => env('DB_PASSWORD'),

            'database' => env('DB_DATABASE'),
            //'schema' => 'myapp',

            'url' => env('DATABASE_URL', null),
        ],

        /*
         * The test connection is used during the test suite.
         */
        'test' => [
            'host' => env('DB_HOST_TEST', 'db'),
            'port' => env('DB_PORT_TEST', '3306'),
            'username' => env('DB_USERNAME_TEST', 'root'),
            'password' => env('DB_PASSWORD_TEST'),
            'database' => env('DB_DATABASE_TEST', 'test_blog_db'),
            'url' => env('DATABASE_TEST_URL', null),
        ],
    ],

    /*
     * Email configuration.
     *
     * Host and credential configuration in case you are using SmtpTransport
     *
     * See app.php for more configuration options.
     */
    'EmailTransport' => [
        'default' => [
            'host' => env('EMAIL_HOST', 'localhost'),
            'port' => env('EMAIL_PORT', '25'),
            'username' => env('EMAIL_USERNAME', null),
            'password' => env('EMAIL_PASSWORD', null),
            'client' => null,
            'url' => env('EMAIL_TRANSPORT_DEFAULT_URL', null),
        ],
    ],
];
