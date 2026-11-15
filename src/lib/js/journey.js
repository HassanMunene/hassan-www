// ─── field notes: photos and videos, grouped in chapters ─────────────────────
//
// how to add media:
//   1. drop your photo (jpg/png/webp/avif) or video (mp4/webm/mov) into
//      src/content/journey/
//   2. add an entry to the chapter's `media` list below:
//        { photo: 'my-photo.jpg', title: '...', caption: 'one line', story: 'a few sentences' }
//        { video: 'site-visit.mp4', poster: 'thumb.jpg', caption: '...' }
//      optional: `when` and `where` ('Nairobi', 'Oct 2025') show under the title.
//   3. the first entry of a chapter becomes its featured photo.
//
// chapters with no matching files yet simply don't show up on the page.
// the text in the placeholder chapters (beginnings, learning, now) is a sketch:
// rewrite it in your own words before you add photos to them.

export const journey = {
	intro: {
		title: 'Field notes',
		text: 'Not a portfolio of polished screenshots, just the moments that got me here. Some from work, some from the road between. This page is the honest one.',
		// a note from you, shown under the intro. edit freely; one string per paragraph.
		note: {
			paragraphs: [
				'I keep this page because the best parts of my work don’t live in a repository. They happen in trainings, on farms, and in the conversations after the slides, with the people who actually use what we build.',
				'Shipping software is only half the job. The other half is going to see how it lands. These are the moments I’d rather show you than tell you about.'
			],
			signoff: '— Munene'
		}
	},
	chapters: [
		{
			id: 'beginnings',
			years: 'The beginnings',
			title: 'Where it started',
			text: 'The first computer I could call mine, the first “hello world” that actually ran, the late nights that didn’t feel late. Nobody claps for this chapter, but every line I write today traces back here.',
			media: [
				{
					photo: 'beginnings-01.jpg',
					caption: 'The machine that started everything.'
				},
				{
					photo: 'beginnings-02.jpg',
					caption: 'First program that actually worked. I remember staring at it like it was magic.'
				}
			]
		},
		{
			id: 'learning',
			years: 'The learning years',
			title: 'Learning by breaking things',
			text: 'Tutorials, crashes, that one deploy that took the whole thing down at 2am. I didn’t know it yet, but this was the curriculum: break, read the error, understand, rebuild.',
			media: [
				{
					photo: 'learning-01.jpg',
					caption: 'The setup where everything got learned, and broken.'
				},
				{
					photo: 'learning-02.jpg',
					caption: 'Proof of the all-nighter: coffee, tabs, and a working feature at sunrise.'
				}
			]
		},
		{
			id: 'work',
			years: 'The work',
			title: 'Shipping real things',
			text: 'The chapter where it got serious: real users, real stakes, real wins. Building systems people depend on changes how you think. Every feature carries a promise, and someone’s day depends on you keeping it.',
			media: [
				{
					photo: 'work-pmis-training-11.jpg',
					caption: 'Presenting the PMIS to a full training room.',
					title: 'On the floor',
					story:
						'The PMIS dashboard on the projector, a room full of laptops, and everyone following along live. This is the part of the job that never shows up in a repository.'
				},
				{
					photo: 'work-pmis-training-06.jpg',
					caption: 'One-to-one time: the questions that matter come after the slides.',
					title: 'After the slides',
					story:
						'The group session explains the system. The one-to-one conversations are where you learn what actually confuses people, and what they were hoping it would do.'
				},
				{
					photo: 'work-pmis-training-07.jpg',
					caption: 'Presenting the PMIS at the Kyaka Hotel, with the Garissa page on the screen.',
					title: 'The Garissa page',
					story:
						'The PMIS gives each of the 13 counties its own page. Here Garissa is on the big screen while I walk the room through what the system shows for it.'
				},
				{
					photo: 'work-pmis-training-08.jpg',
					caption: 'A room full of laptops, everyone following along.',
					title: 'Everyone following along',
					story:
						'Laptops open, the county page on the projector, and the whole room working through the system together.'
				},
				{
					photo: 'work-pmis-training-09.jpg',
					caption: 'Taking the room through the beneficiaries dashboard.',
					title: 'Direct beneficiaries',
					story:
						'The Direct Beneficiaries dashboard on the screen: the view that shows who the interventions are reaching.'
				},
				{
					photo: 'work-pmis-training-10.jpg',
					caption: 'Same room, same dashboard, from another angle.',
					title: 'Presenting the PMIS',
					story:
						'A room set up for training, a podium with the hotel’s name on it, and the PMIS on the projector. This is where the system meets the people it was built for.'
				},
				{
					photo: 'work-pmis-training-01.jpg',
					caption: 'Walking a full room through the PMIS, screen by screen.',
					title: 'Training day',
					story:
						'A full room, the PMIS on the projector, and me taking everyone through it one screen at a time. The system tracks interventions across 13 arid and semi-arid counties, so the people in this room are who it is really for.'
				},
				{
					photo: 'work-pmis-training-02.jpg',
					caption: 'Training the people who will use the system every day.',
					title: 'Teaching the system',
					story:
						'A system only works if people use it, so shipping was only half the job. A training session shows you things a month of building never will: where people hesitate, what they expect a button to do, which word should have been different.'
				},
				{
					photo: 'work-pmis-training-03.jpg',
					caption: 'Questions from the floor are the best product feedback.',
					title: 'Questions from the floor',
					story:
						'The best product feedback comes as questions. Every “where do I find…” is a design note, and every pause before a click is a bug report nobody filed.'
				},
				{
					photo: 'work-pmis-training-04.jpg',
					caption: 'The PMIS on the big screen, and a room of users learning it.',
					title: 'The PMIS, live',
					story:
						'The Project Management Information System on the big screen: a World Bank supported project for the Ministry of Agriculture, built so the government can see which interventions are reaching which counties.'
				},
				{
					photo: 'work-field-01.jpg',
					caption:
						'In the field with the Shamba Records team, checking how farmers use our solutions.',
					title: 'In the field',
					story:
						'Field days are how we check that what we build works for the farmer, not just for us. The platform serves farmers across Kenya, and the only honest way to know if it helps is to go and see.'
				},
				{
					photo: 'work-field-02.jpg',
					caption: 'Software only matters if it works where the farmers are. So we go and see.',
					title: 'Where software meets the farm',
					story:
						'A lot of our users reach the platform from low-connectivity places, so the real test is not the office wifi. It is whether it works here.'
				},
				{
					photo: 'work-field-03.jpg',
					caption: 'Listening to the farmer first. The best feedback comes from watching real use.',
					title: 'Listening first',
					story:
						'The most useful thing an engineer can do on a field visit is stop talking. Watching how someone actually uses the product beats any requirements document.'
				}
			]
		},
		{
			id: 'events',
			years: 'The events',
			title: 'Learning from the room',
			text: 'Conferences and learning events where people building digital agriculture compare notes. I go to listen as much as to show.',
			media: [
				{
					photo: 'events-agrifin-01.jpg',
					caption: 'At the 10th AGRIFIN Learning Event in Nairobi, with Shamba Records.',
					title: '10th AGRIFIN Learning Event',
					where: 'Nairobi',
					story:
						'Shamba Records took part in the 10th AGRIFIN Learning Event, hosted by Prosper Global AGRIFIN (formerly Mercy Corps AGRIFIN) in Nairobi. The theme was “Leveraging evidence for connected, scalable and inclusive digital agriculture”, and the company spoke about how it is using AI in agriculture.'
				}
			]
		},
		{
			id: 'now',
			years: 'Now',
			title: 'Still building, still curious',
			text: 'These days I’m deep in backend systems by day and chasing clean, fast, human interfaces by night. The tools changed. The feeling from chapter one never did.',
			media: [
				{
					photo: 'now-desk-01.jpg',
					caption: 'Today’s view. The stickers multiply; the excitement doesn’t fade.'
				},
				{
					photo: 'now-01.jpg',
					caption: 'Still here. Still building.'
				}
			]
		}
	]
};
