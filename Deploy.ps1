param (
    [Parameter(Mandatory = $True)]
    [string]$App,

    [Parameter(Mandatory = $True)]
    [string]$Env
)

If (@("cb", "laf", "cm", "pm", "pm-lrt") -notcontains $App) {
    throw ("App '$App' is not a valid app")
}

If (@("prod", "next") -notcontains $Env) {
    throw ("Environment '$Env' is not a valid app")
}

switch ($App) {
    "CB" {
        $dirDist = "Llama-Airforce\src\Apps\Cookbook\dist"
        $dirOutput = "Cookbook-Web"
    }
    "LAF" {
        $dirDist = "Llama-Airforce\src\Apps\LlamaAirforce\dist"
        switch ($Env) {
            "Prod" {
                $dirOutput = "Llama-Airforce-Web"
            }
            "Next" {
                $dirOutput = "Llama-Airforce-Web-Next"
            }
        }
    }
    "CM" {
        $dirDist = "Llama-Airforce\src\Apps\CurveMonitor\dist"
        $dirOutput = "Curve-Monitor-Web"
    }
    "PM" {
        $dirDist = "Llama-Airforce\src\Apps\PrismaMonitor\dist"
        $dirOutput = "Prisma-Monitor-Web"
    }
    "PM-LRT" {
        $dirDist = "Llama-Airforce\src\Apps\PrismaMonitor\dist"
        $dirOutput = "Prisma-Monitor-Lrt-Web"
    }
}
# Build website.
Invoke-Expression "npm run 'build $App'"

# Clean git directory
Set-Location ..\$dirOutput
Invoke-Expression "git rm -rf ."

# Move dist to git golder
Move-Item -Path ..\$dirDist\*

# Create new commit & push
Invoke-Expression "git add --all"
Invoke-Expression "git commit -m 'New release'"
Invoke-Expression "git push"

Set-Location ..\Llama-Airforce