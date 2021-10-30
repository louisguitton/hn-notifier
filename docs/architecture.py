"""Architecture diagrams to document ml-entities.

Ref: https://diagrams.mingrammer.com/docs/getting-started/installation
"""
from diagrams import Cluster, Diagram, Edge
from diagrams.firebase.base import Firebase
from diagrams.custom import Custom
from diagrams.programming.language import NodeJS
from diagrams.saas.chat import Discord

with Diagram("hn-notifier", show=False, direction="LR", filename="docs/hn-notifier"):

    with Cluster("Hacker News", direction="TB"):
        hn = Custom("Hacker News", "../assets/Y_combinator_logo.png")
        firebase = Firebase("Hacker News API\nin Firebase")

    app = NodeJS("hn-notifier")

    discord = Discord("Discord server")

    hn >> firebase >> app >> discord
