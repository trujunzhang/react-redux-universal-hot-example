import WebsiteTypes from './websiteTypes';

const ScrapedWebsites = {
  versions: {}
};

//   36 paginations
ScrapedWebsites.scraped_websites_pagination_v1 = {
  //  ==Done
  //  1	DailyO ('http://www.dailyo.in/politics')
  'http://www.dailyo.in/politics': WebsiteTypes.dailyo.name,
  //  2	Deccan Chronicle ('http://www.deccanchronicle.com/opinion')
  'http://www.deccanchronicle.com/opinion': WebsiteTypes.deccanchronicle.name,
  //  3	DNA ('http://www.dnaindia.com/analysis')
  'http://www.dnaindia.com/analysis': WebsiteTypes.dnaindia.name,
  //  4	Firstpost* ('http://www.firstpost.com/category/politics')
  'http://www.firstpost.com/category/politics': WebsiteTypes.firstpost_politics.name,
  'http://www.firstpost.com/category/business': WebsiteTypes.firstpost_business.name,
  'http://www.firstpost.com/category/india': WebsiteTypes.firstpost_india.name,
  'http://www.firstpost.com/category/world': WebsiteTypes.firstpost_world.name,
  //  5	Forbes* ('http://forbesindia.com/')
  'http://www.forbesindia.com/': WebsiteTypes.forbesindia.name,
  //  6	Frontline ('http://www.frontline.in/')
  'http://www.frontline.in/': WebsiteTypes.frontline.name,
  //  7	Hindustan Times ('http://www.hindustantimes.com/opinion/')
  'http://www.hindustantimes.com/opinion/': WebsiteTypes.hindustantimes.name,
  //  8	India Today ('http://indiatoday.intoday.in/calendar')
  'http://indiatoday.intoday.in/calendar': WebsiteTypes.indiatoday.name,
  //  9	Livemint ('http://www.livemint.com/opinion')
  'http://www.livemint.com/opinion': WebsiteTypes.livemint_opinion.name,
  'http://www.livemint.com/mintonsunday': WebsiteTypes.livemint_mintonsunday.name,
  //  10	NDTV ('http://www.ndtv.com/opinion')
  'http://www.ndtv.com/opinion': WebsiteTypes.ndtv.name,
  //  == need pagination test
  //  11	News18 ('http://www.news18.com/blogs/')
  'http://www.news18.com/blogs/': WebsiteTypes.news18.name,
  //  12	Outlook ('')
  'http://www.outlookindia.com/website': WebsiteTypes.outlookindia_website.name,
  'http://www.outlookindia.com/magazine': WebsiteTypes.outlookindia_magazine.name,
  //  13	Rediff.com ('')
  'http://www.rediff.com/news/columns10.html': WebsiteTypes.rediff_columns.name,
  'http://www.rediff.com/news/interviews10.html': WebsiteTypes.rediff_interviews.name,
  //  15	Scroll.in ('')
  'http://scroll.in/': WebsiteTypes.scroll.name,
  //  17	The Economic Times ('')
  //  'http://economictimes.indiatimes.com/opinion/interviews': WebsiteTypes.economictimes_interview.name,
  'http://blogs.economictimes.indiatimes.com/': WebsiteTypes.economictimes_blogs.name,
  //  19	The Financial Express ('')
  'http://www.financialexpress.com/print/edits-columns/': WebsiteTypes.financialexpress.name,
  //  20	The Hindu ('')
  'http://www.thehindu.com/opinion/': WebsiteTypes.thehindu.name,
  //  21	The Hindu BusinessLine ('')
  'http://www.thehindubusinessline.com/opinion/': WebsiteTypes.thehindubusinessline.name,

  //  22	The Huffington Post India ('')
  //  'http://www.huffingtonpost.in/blog/': WebsiteTypes.huffingtonpost.name,
  //  TODO: 30/03/2017(new crawler 'blogs' for the New Indian Express)
  'http://www.huffingtonpost.in/blogs/': WebsiteTypes.huffingtonpost.name,

  //  23	The Indian Economist ('')
  //  v1: (2016)''
  'http://theindianeconomist.com/': WebsiteTypes.theindianeconomist.name,

  //  24	The Indian Express ('')
  //  'http://indianexpress.com/opinion/': WebsiteTypes.indianexpress.name,
  //  TODO: 30/03/2017(new crawler 'opinion' for the New Indian Express)
  'http://indianexpress.com/section/opinion/': WebsiteTypes.indianexpress.name,

  //  25	The New Indian Express ('')
  //  'http://www.newindianexpress.com/opinion/': WebsiteTypes.newindianexpress.name,
  //  TODO: 30/03/2017(new crawler 'opinion' for the New Indian Express)
  'http://www.newindianexpress.com/Opinions': WebsiteTypes.newindianexpress.name,

  //  26	The Pioneer ('')
  'http://www.dailypioneer.com/columnists': WebsiteTypes.dailypioneer.name,

  //  27	The Times of India ('')
  'http://blogs.timesofindia.indiatimes.com/': WebsiteTypes.timesofindia.name,
  //  28	The Tribune ('')
  'http://www.tribuneindia.com/news/opinion/': WebsiteTypes.tribuneindia.name,
  //  29	The Viewspaper ('')
  'http://theviewspaper.net': WebsiteTypes.theviewspaper.name,
  //  30	The Wire ('')
  'http://thewire.in/': WebsiteTypes.thewire.name,
  //  31	The Telegraph ('')
  'https://www.telegraphindia.com': WebsiteTypes.telegraphindia_option.name,
  //  32	The Political Indian ('')
  'http://www.thepoliticalindian.com/': WebsiteTypes.thepoliticalindian.name,
};

ScrapedWebsites.scraped_websites_pagination_v2 = {
  ...ScrapedWebsites.scraped_websites_pagination_v1,

  //  23	The Indian Economist ('')
  //  TODO: DJZHANG(27/09/2017)
  //  v1: (2016)'http://theindianeconomist.com/'
  //  v2: (27/09/2017)'https://qrius.com/'
  'https://qrius.com/': 'theindianeconomist',
};

ScrapedWebsites.websites_allowed_domains_v1 = {
  dailyo: 'www.dailyo.in',
  deccanchronicle: 'www.deccanchronicle.com',
  dnaindia: 'www.dnaindia.com',
  firstpost_politics: 'www.firstpost.com',
  firstpost_business: 'www.firstpost.com',
  firstpost_india: 'www.firstpost.com',
  firstpost_world: 'www.firstpost.com',
  indianexpress: 'www.indianexpress.com',
  theviewspaper: 'theviewspaper.net',
  frontline: 'www.frontline.in',
  forbesindia: 'forbesindia.com',
  hindustantimes: 'www.hindustantimes.com',
  news18: 'www.news18.com',
  theindianeconomist: 'theindianeconomist.com',
  newindianexpress: 'www.newindianexpress.com',
  dailypioneer: 'www.dailypioneer.com',
  thewire: 'thewire.in',
  thepoliticalindian: 'www.thepoliticalindian.com',
  indiatoday: 'indiatoday.intoday.in',
  livemint_opinion: 'www.livemint.com',
  livemint_mintonsunday: 'www.livemint.com',
  ndtv: 'www.ndtv.com',
  outlookindia_website: 'www.outlookindia.com',
  outlookindia_magazine: 'www.outlookindia.com',
  rediff_columns: 'www.rediff.com',
  rediff_interviews: 'www.rediff.com',
  scroll: 'scroll.in',
  economictimes_blogs: 'blogs.economictimes.indiatimes.com',
  financialexpress: 'www.financialexpress.com',
  thehindu: 'www.thehindu.com',
  thehindubusinessline: 'www.thehindubusinessline.com',
  huffingtonpost: 'www.huffingtonpost.in',
  timesofindia: 'blogs.timesofindia.indiatimes.com',
  thetelegraph_option: 'www.telegraphindia.com',
  tribuneindia: 'www.tribuneindia.com',
};

ScrapedWebsites.websites_allowed_domains_v2 = {
  ...ScrapedWebsites.websites_allowed_domains_v1,

  // TODO: DJZHANG(27/09/2017)
  //     v1: (2016)'http://theindianeconomist.com/'
  //     v2: (27/09/2017)'https://qrius.com/'
  theindianeconomist: 'https://qrius.com/',
};

/**
 * 'dnaindia' is siteTag.
 * @type
 */
ScrapedWebsites.siteTags_v2 = [
  WebsiteTypes.dnaindia.name,
  WebsiteTypes.indianexpress.name,
  WebsiteTypes.theviewspaper.name,
  WebsiteTypes.dailyo.name,
  WebsiteTypes.deccanchronicle.name,
  WebsiteTypes.frontline.name,
  WebsiteTypes.forbesindia.name,
  WebsiteTypes.hindustantimes.name,
  WebsiteTypes.news18.name,
  WebsiteTypes.theindianeconomist.name,
  WebsiteTypes.newindianexpress.name,
  WebsiteTypes.dailypioneer.name,
  WebsiteTypes.thewire.name,
  WebsiteTypes.thepoliticalindian.name,
  WebsiteTypes.indiatoday.name,
  WebsiteTypes.ndtv.name,
  WebsiteTypes.scroll.name,
  WebsiteTypes.thehindu.name,
  WebsiteTypes.thehindubusinessline.name,
  WebsiteTypes.huffingtonpost.name,
  WebsiteTypes.timesofindia.name,
  WebsiteTypes.tribuneindia.name,
  WebsiteTypes.telegraphindia_option.name,
  WebsiteTypes.firstpost_politics.name,
  WebsiteTypes.firstpost_business.name,
  WebsiteTypes.firstpost_india.name,
  WebsiteTypes.firstpost_world.name,
  WebsiteTypes.outlookindia_website.name,
  WebsiteTypes.outlookindia_magazine.name,
  WebsiteTypes.economictimes_blogs.name,
  WebsiteTypes.rediff_columns.name,
  WebsiteTypes.rediff_interviews.name,
  WebsiteTypes.livemint_opinion.name,
  WebsiteTypes.livemint_mintonsunday.name,
];

ScrapedWebsites.WebsiteDraft_v2 = [
  WebsiteTypes.firstpost.name,
  WebsiteTypes.frontline.name,
  WebsiteTypes.indiatoday.name,
  WebsiteTypes.livemint_mintonsunday.name,  //# only drafts for mintonsunday
  //# We just need to make one change. The posts from outlookindia.com should go to drafts.name, not published.
  WebsiteTypes.outlookindia_magazine.name,
  WebsiteTypes.outlookindia_website.name,
  WebsiteTypes.scroll.name,
  WebsiteTypes.thewire.name,
  WebsiteTypes.forbesindia.name,
];

ScrapedWebsites.versions.websiteDrafts = {
  'v2': ScrapedWebsites.WebsiteDraft_v2
};

ScrapedWebsites.versions.websitesAllowedDomains = {
  'v1': ScrapedWebsites.websites_allowed_domains_v1,
  'v2': ScrapedWebsites.websites_allowed_domains_v2,
};

ScrapedWebsites.versions.websitesPaginations = {
  'v1': ScrapedWebsites.scraped_websites_pagination_v1,
  'v2': ScrapedWebsites.scraped_websites_pagination_v2,
};


ScrapedWebsites.versions.siteTags = {
  'v2': ScrapedWebsites.siteTags_v2,
};


export default ScrapedWebsites;

