## Authenticate with Google Cloud Artifact Registry

To install the Adelco dependency for web-components `(@adelco/web-components)` in your frontend monorepo, you need to have a `Google Cloud` account and authenticate it with the `adelco-corp-cicd` project (need read access to `Google Cloud Artifact Registry`). Follow the steps below:

1. Log in to `Google Cloud` using the following command in your terminal:

    ```code
    gcloud auth login
    ```

2. Authenticate the `Google Cloud` application with your project by running the following command:

    ```code
    gcloud auth application-default login --project adelco-corp-cicd
    ```

3. Set the `Google Cloud project` configuration to `adelco-corp-cicd`:

    ```code
    gcloud config set project adelco-corp-cicd
    ```

4. Finally, run the following command to authenticate your `Google Artifact Registry`:

    ```code
    npx google-artifactregistry-auth
    ```

Now you can install the packages in your frontend monorepo.


