gitlab url = [https://gitlab.cs.uct.ac.za/vlkale003/solarvizcapestone]

- Marking AID/ASSISTANCE [BASED ON RUBRIC PROVIDED] -

---------------------------------------- Logical classes, methods etc [/5] ----------------------------------------------------------- 

Main classes include [Display Page, DisplayItem, DataCollector, RequestHandler, Auth, Global] 

- The display Page class holds all information regarding 'pages' and children display item classes.
- The display Item class holds information regarding a display item, e.g graph, data, color [all accesible via methods].
- Data collector class is a backend class that holds data for formating, has methods for retreiving and formating data from backend.
- Request Handler class is a backend class that runs on the main server, it directs incoming requests to the right routes.
- Auth class holds infomation regarding login status, and has mehtods for logining the user in and out.
- Global class holds information regarding if we are in loading state, error state and methods to alter these.
[There are more smaller classes but these are the 'main' backbone classes]


----------------------------------- Appropriate use of Lanaguage Features [/5] -----------------------------------------------------------

- On the frontend React and Javascript was used, therfore the newest form of javscript ES6 functions were used [const method = () => {}]
- In addition advanced single line functions were used e.g transpose array function (see UI/Displayitem.js line 49)
- Inline JSX was used for returning HTML code
- Inline styling was used
- Appropriate React hooks were deployed (useState, useEffect, useNavigate)
- Advanced inline logic was used for conditionals ({condition} ? {<div>True</div>} : {<div>False</div>})

-Python networking packages [flask] were deployed along with regex url matching protocols

----------------------------------------- Layout [/5] -------------------------------------------------------------------------------

- React Specific file structure was followed [As per react docs]
	[src]
	  [components]
		[Routing]
		[UI]
          [context]
		[auth]
		[global]
	  [hooks]
	  [pages]
- Indedation was follwed for the returning of any jsx elements 
- Repeated components e.g display items, or grid items were broken down into individual files for easy re-use and modularity


-------------------------------- Variable, Class, Method Names[/5] -----------------------------------------------------------------------

- Respective React component names followed the react naming convention [Capital first]
- Other methods folled respective languages naming conventions
- Variables and class names were to be as descriptive as possible
- E.G [displayItem, DataCollector, Auth]
- state variables were also named acording to use, making them understanable and not random e.g xAxisLength vs x


------------------------------------ Commments[/5] -------------------------------------------------------------------------------

- See python backend/app.py and backend/dataCollector.py for example of commenting structures
- Each file has a small description of what the file/class does at the top of the file
- Each method has small description of what the method does [expected inputs and outputs]
- No major comments in JSX return code due to cluttering of comments
- JSX return code has heading section comments e.g {Navbar} {Period Input} {Graph Selector} 