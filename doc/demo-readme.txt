1. Intro.

I’ve been doing technical interviews at the company I work for for almost two years now.
And one thing I keep noticing is that a lot of developers get uncomfortable once the conversation moves to deployments.
We can talk architecture, APIs, clean code, scaling — no problem.
But when the question becomes “How do you actually deploy this?” the answer is often:
“Well… we have a DevOps person for that.”
And that’s fine — a lot of teams work that way.
But I still think every developer should understand the basics of how their application gets deployed, runs, and survives outside their laptop.
On our project, developers handle not only the code, but also infrastructure, deployments, configuration, and making sure everything actually works in production.
So in this demo, I want to go through the minimum deployment knowledge I think every developer should know.
And to keep it simple, we’ll use a small distributed application as an example.

We’ll have 4 parts: UI, API, Proc, Database.
Demo image: doc\img\01-app-architecture.png

And we’ll start with the easiest setup possible: let's run the whole thing locally.

Demo image: doc\img\02-local-run.png


2. Local env setup.
Prerequisites:
- Docker, I will use Podman.
- Kubernetes, I will use Kind
- PowerShell
- Windows OS

Build and run containers locally.

./doc/01-run-local.txt

All installed localy on my laptop.


3. Run all with Docker Compose.
It is possible to run all services with Docker Compose. It will build all images and run containers.
```
.\run-compose.ps1
```
Test
Open API in your browser:  http://localhost:3031
Open UI in your browser:  http://localhost:3032
Open Podman to check containers, create new city in IU, run Proc from Podman, check city in UI.

Now we done with local setup during develoment and testing. We can run complete services setup on Portainer or any type of Docker Compose deployment infradtructure.
I have a fieling that a lot of developers stop here and do not go further with their deployments. What we will try to do next is to simulate production deployment with Kubernetes. I will run everything locally on my laptop but you can apply the same principles to any Kubernetes cluster in any cloud or on-premise environment.

Delete all containers and volumes before moving on.

3. Create kubernetes cluster
First of all we need to create a Kubernetes cluster. I will use Kind for this.

My Kubernetes cluster will host everything: api, ui, proc and database.
Demo image: doc\img\03-kubernetes-cluster.png

We will deploy one database with persistent storage.
One Proc container as CronJob.
3 instances of API.
3 instances of UI.

4. Deploy apps to kubernetes.
./infra/readme.txt

5. Demo rolling update
Demo image: doc\img\04-rolling-update.png
./infra/02-RollingUpdate/readme.txt

We can see how deploying new versions of our apps is done automatically and on one mentioned releasing new versions of our apps.

6. Demo canary deployment
Demo image: doc\img\05-canary.png
./infra/03-Canary/readme.txt

We have both old and new version working together. The new version is deployed with a canary strategy, so it is not yet visible to all users.

7. Demo blue green deployment
Demo image: 06-blue-green. CREATE BLUE GREEN
./infra/04-BlueGreen/readme.txt

We have both old and new version working together. The new version is deployed with a blue-green strategy, so it is not yet visible to all users.
When we are ready with new version, we can switch traffic to it.
