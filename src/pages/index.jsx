import Layout from "./Layout.jsx";

import Scan from "./Scan";

import Documents from "./Documents";

import Settings from "./Settings";

import Templates from "./Templates";

import Insights from "./Insights";

import Home from "./Home";

import PdfGuide from "./PdfGuide";

import PdfTools from "./PdfTools";

import ConvertTools from "./ConvertTools";

import AiTools from "./AiTools";

import AudioTools from "./AudioTools";

import AuthLanding from "./AuthLanding";

import DocumentConverter from "./DocumentConverter";

import ImageConverter from "./ImageConverter";

import OcrTool from "./OcrTool";

import AudioConverter from "./AudioConverter";

import VideoConverter from "./VideoConverter";

import Compress from "./Compress";

import Premium from "./Premium";

import FileConversionGuide from "./FileConversionGuide";

import Blog from "./Blog";

import About from "./About";

import Privacy from "./Privacy";

import Terms from "./Terms";

import Contact from "./Contact";

import Faq from "./Faq";

import Guides from "./Guides";

import Api from "./Api";

import Security from "./Security";

import Cookies from "./Cookies";

import Accessibility from "./Accessibility";

import AiPdfAnalysis from "./AiPdfAnalysis";

import Profile from "./Profile";

import ConversionHistory from "./ConversionHistory";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Scan: Scan,
    
    Documents: Documents,
    
    Settings: Settings,
    
    Templates: Templates,
    
    Insights: Insights,
    
    Home: Home,
    
    PdfGuide: PdfGuide,
    
    PdfTools: PdfTools,
    
    ConvertTools: ConvertTools,
    
    AiTools: AiTools,
    
    AudioTools: AudioTools,
    
    AuthLanding: AuthLanding,
    
    DocumentConverter: DocumentConverter,
    
    ImageConverter: ImageConverter,
    
    OcrTool: OcrTool,
    
    AudioConverter: AudioConverter,
    
    VideoConverter: VideoConverter,
    
    Compress: Compress,
    
    Premium: Premium,
    
    FileConversionGuide: FileConversionGuide,
    
    Blog: Blog,
    
    About: About,
    
    Privacy: Privacy,
    
    Terms: Terms,
    
    Contact: Contact,
    
    Faq: Faq,
    
    Guides: Guides,
    
    Api: Api,
    
    Security: Security,
    
    Cookies: Cookies,
    
    Accessibility: Accessibility,
    
    AiPdfAnalysis: AiPdfAnalysis,
    
    Profile: Profile,
    
    ConversionHistory: ConversionHistory,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Scan />} />
                
                
                <Route path="/Scan" element={<Scan />} />
                
                <Route path="/Documents" element={<Documents />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/Templates" element={<Templates />} />
                
                <Route path="/Insights" element={<Insights />} />
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/PdfGuide" element={<PdfGuide />} />
                
                <Route path="/PdfTools" element={<PdfTools />} />
                
                <Route path="/ConvertTools" element={<ConvertTools />} />
                
                <Route path="/AiTools" element={<AiTools />} />
                
                <Route path="/AudioTools" element={<AudioTools />} />
                
                <Route path="/AuthLanding" element={<AuthLanding />} />
                
                <Route path="/DocumentConverter" element={<DocumentConverter />} />
                
                <Route path="/ImageConverter" element={<ImageConverter />} />
                
                <Route path="/OcrTool" element={<OcrTool />} />
                
                <Route path="/AudioConverter" element={<AudioConverter />} />
                
                <Route path="/VideoConverter" element={<VideoConverter />} />
                
                <Route path="/Compress" element={<Compress />} />
                
                <Route path="/Premium" element={<Premium />} />
                
                <Route path="/FileConversionGuide" element={<FileConversionGuide />} />
                
                <Route path="/Blog" element={<Blog />} />
                
                <Route path="/About" element={<About />} />
                
                <Route path="/Privacy" element={<Privacy />} />
                
                <Route path="/Terms" element={<Terms />} />
                
                <Route path="/Contact" element={<Contact />} />
                
                <Route path="/Faq" element={<Faq />} />
                
                <Route path="/Guides" element={<Guides />} />
                
                <Route path="/Api" element={<Api />} />
                
                <Route path="/Security" element={<Security />} />
                
                <Route path="/Cookies" element={<Cookies />} />
                
                <Route path="/Accessibility" element={<Accessibility />} />
                
                <Route path="/AiPdfAnalysis" element={<AiPdfAnalysis />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/ConversionHistory" element={<ConversionHistory />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}