# A2. Exploratory Data Analysis 

## Spyros Garyfallos

### W209 - Section 1 - 2019 Summer

## Dataset : County data from the 2000 Presidential Election in Florida

For each of the 67 Florida counties, the data include the type of voting machine used, the number of columns in the presidential ballot, the undervote, the overvote, and the official certified votes for each of the twelve presidential candidates. Of particular interest are the Buchanan vote in Palm Beach county, and the overvote as a function of voting machine type and number of columns. Data is from the CMU Statistical Data Repository. (Note: be sure you save the text file properly. Some browsers may add extra characters.) Background on the Florida butterfly ballot

> Hypothesis 1: Most overvoting happened using Votomatic voting technology.

![Overvoting per voting technology](images/1.png "Overvoting per voting technology")


**What's informative about this view**: This view is helpful in gaining an overview of the distribution of overvoting size per voting technology. It shows that most overvoting happened using the Votomatic, and in second place, the Optical technology

**What could be improved about this view:** Because the overvoting information is the actual overvotes count, it would be more useful to have the information of overvoting as an average percentage over the total votes.

![Average overvoting percentage per voting technology](images/2.png "Average overvoting percentage per voting technology")


**What's informative about this view**: This view is helpful in gaining a better understanding what is the average percentage of overvoting per technology. We can tell that as an average percentage, the top overvoted technology is actually the Datavote and second but in close place the hand voting.

**What could be improved about this view:** It would be interesting to see what's the impact in overvoting per columns number.

![Average overvoting percentage per voting technology per column number](images/3.png "Average overvoting percentage per voting technology per column number")

**What's informative about this view**: This view is helpful in gaining a better understanding what is the impact of the number of columns and the voting technology in overvoting. We can see that for two columns, Lever actually has zero overvoting, and that for one column, by hand also has zero overvoting.

>Conclusion: Most overvoting as a percentage happens with Datavote and optical, for one and two columns respectively. On the other antipode, Hand and Lever are the suggested voting technologies for one and two columns respectively, since there is zero overvoting.


> Hypothesis 2: Most overvoting happened in county Duval:

We'll start with plotting the number of overvoting per county:

![Overvoting per county](images/4.png "Overvoting per county")

**What's informative about this view**: Indeed, in Duval county we had the maximum overvoting, in absolute numbers. 

**What could be improved about this view:** Again, because the overvoting information is the actual overvotes count, it would be more useful to have the information of overvoting as an average percentage over the total votes.

![Average overvoting percentage per county](images/5.png "Average overvoting percentage per county")

**What's informative about this view**: When using the average percentage, we see that in Gadsden we actually had the most overvoting relative to the number of votes

> Hypothesis 3: Buchanan is very popular in Palm Beach county.

![Absolute and percentage popularity of Buchanan](images/6.png "Absolute and percentage popularity of Buchanan")

**What's informative about this view**: Here, we can clearly see the general distribution of the percentage popularity, and in a clear outlier of the absolute votes in Parm Beach. 

> Buchanan ad controversies
Buchanan was criticized for running ads that allegedly promoted racist ideals. One such ad included an individual choking on a meatball, unable to call for help, as the operator does not immediately respond in English

Doing some more research online, we discover that Pat Buchanan actually got most of his votes by mistake.
