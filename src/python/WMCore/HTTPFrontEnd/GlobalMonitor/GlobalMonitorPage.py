#!/usr/bin/env python

"""
The documentation for the framework
"""

from cherrypy import expose
from os import listdir
from os import path
from cherrypy import HTTPError
from cherrypy.lib.static import serve_file

from WMCore.Lexicon import check
from WMCore.WebTools.Page import TemplatedPage

def serveFile(contentType, prefix, *args):
    """Return a workflow from the cache"""
    name = path.normpath(path.join(prefix, *args))
    if path.commonprefix([name, prefix]) != prefix:
        raise HTTPError(403)
    if not path.exists(name):
        raise HTTPError(404, "%s not found" % name)
    return serve_file(name, content_type = contentType)

class GlobalMonitorPage(TemplatedPage):
    """
    The documentation for the framework
    """
    @expose
    def index(self):
        """
        The index of the documentation
        """
        #TODO: template solution is commented out.
        #If the monitoring view is almost the same use template
        #otherwise use diffent html
        #reqmonitorJS = "RequestMonitor.js"
        frontPage = "index.html"
        if self.config.serviceLevel == "LocalQueue":
            #reqmonitorJS = "LocalRequestMonitor.js"
            frontPage = "LocalIndex.html"
        #return self.templatepage("FrontPage", reqmonitorJS = reqmonitorJS)
        return serveFile('text/html',
                    path.join(self.config.html, 'GlobalMonitor', frontPage))

    @expose
    def default(self, *args):
        """
        Show the documentation for a page or return the index
        """
        if len(args) > 0:
            return serveFile('text/html',
                             path.join(self.config.html, 'GlobalMonitor'),*args)
        else:

            return self.index()

    @expose
    def javascript(self, *args):
        if args[0] == "external":
            return serveFile('application/javascript',
                             path.join(self.config.javascript), *args)
        return serveFile('application/javascript',
                          path.join(self.config.javascript,
                                    'WMCore', 'WebTools'), *args)

    @expose
    def css(self, *args):
        if args[0] == "external":
            return serveFile('text/css',
                             self.config.css, *args)
        return serveFile('text/css',
                          path.join(self.config.css,
                                    'WMCore', 'WebTools'), *args)
