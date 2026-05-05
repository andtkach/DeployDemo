Demo apps:

ui, api, proc, test, infra



UI

Nginx container with html page. Index html executes js on page load and asks api for data with GET request. Then shows response in the html page. Also on html page typed version of UI application and page has a blue background. If api server is not available we will show friendly error on index page.

API

Has node.js server handles get request and returns json response with following payload: servername, app version, datetime of response.



Proc

Nodejs app which will be executed by cronjob from kubernetes. App starts, waits for random milliseconds from 0 to 1000, prints date and time, servername, app version and waits from more random 0-1000 milliseconds and stops.  



Test

Test file 1. Nodejs script which runs every second and gets html from UI app. It parses response from html get request and prints on console version of ui application and its background color. 

Test file 2. Nodejs script which runs every second and gets json from API and prints server name and version.



Deployments: blue green, canary, rolling updates

UI app demos blue green deployment

API app demos canary deployment





Kube namespace: depdemo



I often conduct technical interviews and am surprised to find that the topic of deployment often causes difficulty for candidates.

For some reason, everyone has a dedicated dev ops person who deploys and monitors everything.

Fortunately, in our project, programmers handle all infrastructure, including deployments.

I'll try to outline the minimum set of knowledge and practices that every programmer should know and be able to master when it comes to deploying their applications.

For example, let's take a distributed application consisting of a UI, API, and proc.

Let's run everything locally.

Build Docker images with version 1 of all services.

Deploy everything to Kubernetes.

Start changing applications and building new versions.

To demonstrate blue-green deployment, we'll create a new version of the UI app with a green background and version 2.

We'll build a new container with version 2 and deploy it alongside the old version.

The old version is available on port 3011, and the new version on port 3012.

The public version is on port 80.

Next, to demonstrate canary deployment, we'll change the API version 2 and direct 20 percent of traffic to the new version.

Then we'll completely switch to the new version 2 and remove the old API deployment.



To demonstrate rolling updates and zero downtime, we'll create version 3 of the UI API and proc and deploy everything simultaneously, running both tests. We'll also look at the log, which will show the new app versions.



Deployment schema

5 UI, 5 API, 5 Proc

