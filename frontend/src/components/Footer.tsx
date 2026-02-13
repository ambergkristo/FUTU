import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n/I18nContext';
import { getUi } from '../copy/ui';

interface FooterProps {
  scrollToSection: (sectionId: string) => void;
}

const Footer: React.FC<FooterProps> = ({ scrollToSection }) => {
  const { lang } = useLang();
  const ui = getUi(lang);

  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="section-inner">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-4">
              FUTU
            </h4>
            <p className="text-slate-400 text-sm">
              {ui.footer.tagline}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-cyan-400 mb-4">{ui.footer.quickLinks}</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><button onClick={() => scrollToSection('about')} className="hover:text-cyan-400 transition-colors">{ui.footer.links.about}</button></li>
              <li><button onClick={() => scrollToSection('rooms')} className="hover:text-cyan-400 transition-colors">{ui.footer.links.rooms}</button></li>
              <li><button onClick={() => scrollToSection('pricing')} className="hover:text-cyan-400 transition-colors">{ui.footer.links.pricing}</button></li>
              <li><Link to="/booking" className="hover:text-cyan-400 transition-colors">{ui.footer.links.book}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-cyan-400 mb-4">{ui.footer.legal}</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">{ui.footer.links.privacy}</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">{ui.footer.links.terms}</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">{ui.footer.links.cookies}</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">{ui.footer.links.refund}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-cyan-400 mb-4">{ui.footer.socialLabel}</h4>
            <div className="flex space-x-4">
              {['Facebook', 'Instagram', 'Discord'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="w-10 h-10 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  {social[0]}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400 text-sm">
          <p>{ui.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
