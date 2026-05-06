1. Intro.

One thing I keep noticing in technical interviews is that deployment becomes a weird blind spot for a lot of developers.

You can talk architecture, APIs, clean code, scaling — no problem.
But once the conversation gets to *“How do you actually deploy this thing?”* it often gets uncomfortable.

And the answer is usually something like:
*“Well… we have a DevOps person for that.”*

Which is fair — a lot of teams work like that.
But I still think every developer should know the basics of how their app gets deployed, how it runs, and what happens after it leaves their laptop.

Nothing too fancy.
Just the practical stuff you really should be comfortable with as a programmer.

On our project, developers handle all of that ourselves — not just writing code, but also dealing with infrastructure, deployments, config, and making sure things actually run.

And honestly, that’s the part I want to talk about.

In this video, I’ll go through the minimum set of deployment knowledge I think every developer should have.

Nothing theoretical, nothing overengineered — just the practical basics that help you ship software without treating production like magic.

To make it real, let’s use a simple distributed app as an example.

We’ll have three parts:

UI,
API,
and Proc.

Demo image 01-app-architecture. CREATE APP ARCHITECTURE

And we’ll start with the easiest setup possible:

Let's run the whole thing locally.

Demo image 02-local-run. CREATE LOCAL RUN

Build and run containers locally.

2. Local env setup.
Prerequisites:
- Docker, I will use Podman.
- Kubernetes, I will use Kind

All installed localy on my laptop.



3. Create kubernetes cluster


4. Deploy apps to kubernetes.

5. Demo rolling update

6. Demo canary deployment

7. Demo blue green deployment
