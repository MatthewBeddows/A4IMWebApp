document.addEventListener('DOMContentLoaded', function () {
    const mainMenu = document.getElementById('mainMenu');
    const systemView = document.getElementById('systemView');
    const progressBar = document.getElementById('progressBar');
    const progress = document.getElementById('progress');

    // Show system view button
    document.getElementById('btnSystemView').addEventListener('click', () => {
        mainMenu.style.display = 'none';
        systemView.style.display = 'block';
        loadSystems();
    });

    // Back to main menu button
    document.getElementById('btnBackToMenu').addEventListener('click', () => {
        systemView.style.display = 'none';
        mainMenu.style.display = 'block';
    });

    function loadSystems() {
        const targetUrl = 'https://raw.githubusercontent.com/MatthewBeddows/A4IM-ProjectArchitect/main/architect.txt';
        
        fetch(targetUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => parseProjectArchitect(data))
            .catch(error => {
                console.error('Error fetching Project Architect file:', error);
                alert('Failed to download Project Architect file. Check console for details.');
                progressBar.style.display = 'none';  // Hide progress bar on error
            });
    }

    function parseProjectArchitect(content) {
        // Extract system addresses (URLs) from the architect file content
        let systemAddresses = content.split('\n')
            .filter(line => line.trim().startsWith('[system address]'))
            .map(line => line.split('] ')[1].trim());

        if (systemAddresses.length === 0) {
            console.error('No system addresses found in the architect file.');
            alert('No system addresses found in the architect file.');
            return;
        }

        // Convert GitHub URLs to raw content URLs or use them directly
        let rawUrls = systemAddresses.map(convertToRawUrl);

        // Download each systemInfo.txt based on its URL
        downloadSystemInfos(rawUrls);
    }

    function convertToRawUrl(githubUrl) {
        try {
            // Parse the GitHub URL to construct the raw content URL
            let urlParts = githubUrl.replace('https://github.com/', '').split('/');
            let user = urlParts[0];
            let repo = urlParts[1];
            let branch = 'main';  // Assuming 'main' branch, update if different
            let filePath = 'systemInfo.txt'; // Adjust based on the actual file path in the repositories

            // Construct the raw URL
            let rawUrl = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${filePath}`;
            return rawUrl;
        } catch (error) {
            console.error('Error converting to raw URL:', error);
            return '';
        }
    }

    function downloadSystemInfos(urls) {
        if (urls.length === 0) {
            alert('No valid system URLs to download.');
            console.error('No valid system URLs to download.');
            return;
        }

        progressBar.style.display = 'block';
        progress.value = 0; // Reset progress bar

        let completed = 0;
        let moduleUrls = [];

        urls.forEach((url, index) => {
            if (!url) {
                console.error('Invalid URL:', url);
                return;
            }

            console.log(`Attempting to fetch: ${url}`); // Debug log to check URLs
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
                    }
                    completed++;
                    progress.value = (completed / urls.length) * 100;
                    console.log(`Successfully downloaded: ${url}`);

                    return response.text(); // Return text to process content
                })
                .then(data => {
                    // Process the downloaded systemInfo.txt to find module URLs
                    const newModuleUrls = parseSystemInfo(data);
                    moduleUrls = moduleUrls.concat(newModuleUrls);

                    if (completed === urls.length) {
                        alert('All systemInfo files downloaded successfully. Starting to download modules...');
                        progressBar.style.display = 'none';
                        downloadModules(moduleUrls); // Start downloading modules after all systemInfo files are processed
                    }
                })
                .catch(error => {
                    console.error('Error downloading file:', error);
                    alert(`Failed to download file: ${error.message}`);
                    progressBar.style.display = 'none';  // Hide progress bar on error
                });
        });
    }

    function parseSystemInfo(content) {
        // Extract module addresses (URLs) from the systemInfo file content
        let moduleAddresses = content.split('\n')
            .filter(line => line.trim().startsWith('[Module Address]'))
            .map(line => line.split('] ')[1].trim());

        if (moduleAddresses.length === 0) {
            console.log('No module addresses found in the systemInfo file.');
        }

        // Convert GitHub URLs to raw content URLs
        let rawModuleUrls = moduleAddresses.map(convertModuleToRawUrl);

        return rawModuleUrls;
    }

    function convertModuleToRawUrl(githubUrl) {
        try {
            // Parse the GitHub URL to construct the raw content URL
            let urlParts = githubUrl.replace('https://github.com/', '').split('/');
            let user = urlParts[0];
            let repo = urlParts[1];
            let branch = 'main';  // Assuming 'main' branch, update if different
            let filePath = 'README.md'; // Assuming we want the README file; adjust as needed

            // Construct the raw URL
            let rawUrl = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${filePath}`;
            return rawUrl;
        } catch (error) {
            console.error('Error converting module URL to raw URL:', error);
            return '';
        }
    }

    function downloadModules(urls) {
        if (urls.length === 0) {
            alert('No modules to download.');
            console.error('No modules to download.');
            return;
        }

        progressBar.style.display = 'block';
        progress.value = 0; // Reset progress bar

        let completed = 0;

        urls.forEach((url, index) => {
            console.log(`Attempting to fetch module: ${url}`); // Debug log to check URLs
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch module ${url}: ${response.statusText}`);
                    }
                    completed++;
                    progress.value = (completed / urls.length) * 100;
                    console.log(`Successfully downloaded module: ${url}`);

                    if (completed === urls.length) {
                        alert('All modules downloaded successfully.');
                        progressBar.style.display = 'none';
                    }
                    return response.text();
                })
                .then(data => {
                    // Handle the module data as needed here
                    console.log('Downloaded module data:', data);
                })
                .catch(error => {
                    console.error('Error downloading module:', error);
                    alert(`Failed to download module: ${error.message}`);
                    progressBar.style.display = 'none';  // Hide progress bar on error
                });
        });
    }

    function showDocs() {
        console.log("Navigating to User Docs...");
        alert("User Docs will be shown here.");
    }

    function showAbout() {
        console.log("Showing About information...");
        alert("About information will be shown here.");
    }

    function closeApp() {
        console.log("Exiting the application...");
        alert("Application will close (in desktop apps, not in a browser).");
    }
});
