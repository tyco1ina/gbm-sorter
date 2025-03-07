Tiberius Colina
17 February 2025
Buzzfeed Quiz Software Design Document

Abstract

This serves as the official software design document for the FSA March GBM Philippine Folklore Buzzfeed Quiz (writing this doc so it can go in my Github woooo). The purpose of this software is to sort the attendees of the GBM into five teams, along with acting as the sign-in form of the GBM. Attendees will fill out the quiz, first answering questions related to their name, year, etc, and then answering several questions about their personality, and with these inputs, the software will determine which figure of Philippine folklore aligns with the attendee the best. This method provides a fun, introspective, and unbiased way of creating five groups for the GBM.

Previous Work

Before the quiz is made, it is important to understand the mythological figures that will be used for this quiz. The three main figures in the Halo Halo script are Duwende, Aswang, and Maria Makiling. Two more figures must be chosen to make a total of five groups, so we’ll choose Idiyanale and Mapulon.
Duwende are small, mischievous supernatural creatures in Philippine folklore, often depicted as goblin-like beings living in trees, houses, or anthills. They can be either benevolent or malevolent, rewarding those who respect them and cursing those who offend them. People often say "Tabi-tabi po" (Excuse me) when passing their supposed dwellings to avoid their wrath.
The Aswang is a shape-shifting monster in Philippine mythology, often described as a vampire, ghoul, or witch that preys on humans, especially pregnant women and children. By day, they appear as ordinary people, but at night, they transform into terrifying creatures to hunt their victims. Fear of the Aswang is deeply rooted in Filipino culture, with various folklore and rituals developed to ward them off.
Maria Makiling is a mystical guardian spirit of Mount Makiling, often depicted as a beautiful woman with long, flowing hair who protects the forest and its creatures. She is known for her kindness and generosity but also for her tragic love story, where she falls for a mortal who ultimately betrays her. Heartbroken, she retreats into the mountain, and it is said that her presence is still felt in the mist and lush greenery of Mount Makiling.
Idiyanale is the Tagalog goddess of labor and good deeds, worshipped by early Filipinos as the deity who oversees work and industry. Farmers and fishermen would often offer prayers to her for a bountiful harvest and successful endeavors. She is sometimes associated with diligence and perseverance, embodying the value of hard work in Filipino culture.
Mapulon is the god of seasons and husband to the goddess Idiyanale, governing the cycles of nature that bring change and growth. He is associated with the transitions between dry and wet seasons, crucial for agriculture in the Philippines. 

Methods
	
The quiz will be displayed on a single-page web application written in React.js. All backend operations will use AWS. There will be a DynamoDB table that will store the information submitted by the attendees.
Sign-in data table: Contains information such as first name, last name, year, email, and mailing list preference and also contains the ranking of the groups for each person.

There will be four AWS Lambda functions that will handle the primary backend operations.
Form submit: When a user completes the quiz, this function will handle the information the user has entered. Basic information will be saved in the Sign-in table. Based on the user’s answer to the quiz, a ranking for figure alignment will be decided and saved in the Alignment table
Export to Sheets: This function will export the Sign-in data table to an excel spreadsheet.
Sort: This function sorts the attendees into groups based on their figure alignment rankings. The input to this function will be a list of n tuples, {(xi​,yi​) | i = 1,2,…,n}, where xi is the name of the ith GBM attendee and yi​ is the figure alignment ranking of the ith GBM attendee. For each tuple, the algorithm goes through each figure in yi​ and checks if that group is full (group size >= floor(n / 5)). This will produce five approximately even groups.
RandomSort: Randomly assings people to groups if the normal sorting algo fails for any reason

After the sorting, attendees will be assigned to their groups WITHOUT knowing which figure they align with. With their group, they try to figure out which figure they align with. They are given descriptions of each mythological figure and the questions asked during the quiz.
