// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use cooklang::{model::Recipe, parse, parser::ParserError};
use log::{error, trace};
use std::{fs, io::Write, path::PathBuf, time::UNIX_EPOCH};
use tauri::api::process::{self, CommandEvent};
use tauri_plugin_log::LogTarget;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn write_json(json: &str, path: &str) -> Result<String, String> {
    // let mut res_dir = app.path_resolver().app_data_dir().unwrap();
    let file_name = "ctk-test.json"; // migstodo: versioned name
                                     // res_dir.push(file_name);
    let mut file_path = PathBuf::new();
    file_path.push(path);
    file_path.push(file_name);
    trace!("attempting write to: {:#?}", file_path);
    // let mut perms = fs::metadata(&file_path)
    //     .map_err(|e| e.to_string())?
    //     .permissions();
    // if perms.readonly() == true {
    //     perms.set_readonly(false);
    //     fs::set_permissions(&file_path, perms).map_err(|e| e.to_string())?;
    // }
    let mut file = std::fs::File::create(&file_path).map_err(|e| e.to_string())?;
    file.write_all(json.as_bytes()).map_err(|e| e.to_string())?;
    trace!("WROTE TO: {:#?}", file_path);
    Ok("Invoked successfully".into())
}

#[tauri::command]
async fn exec_wtd(path: &str, name: &str, out: &str) -> Result<String, String> {
    let json_name = "ctk-test.json"; // migstodo: versioned name?
    let mut in_path = PathBuf::new();
    in_path.push(path);
    in_path.push(json_name);
    let mut out_path = PathBuf::new();
    out_path.push(out);
    out_path.push(name);
    trace!(
        "attempting write to: {:#?}",
        &out_path.as_os_str().to_str().unwrap().to_string()
    );
    let cmd = process::Command::new_sidecar("ctk4400_cli").map_err(|e| e.to_string())?;
    let (mut rx, mut child) = cmd
        .args([
            "wtd-wrapper".to_owned(),
            in_path.as_os_str().to_str().unwrap().to_string(),
            out_path.as_os_str().to_str().unwrap().to_string(),
        ])
        .spawn()
        .map_err(|e| e.to_string())?;
    while let Some(event) = rx.recv().await {
        if let CommandEvent::Stdout(line) = &event {
            trace!("{}", line);
        }
        if let CommandEvent::Stderr(line) = &event {
            if line.contains("Exception:") {
                // error!("{}", line); // migstodo: needed?
                return Err(line.into());
            }
        }
    }
    Ok("Sure".into())
}

#[allow(dead_code)]
#[tauri::command]
fn exec_dtw(_input_file: &str, _output_path: &str) -> Result<String, String> {
    // 1. Execute ctk4400_cli
    // 2. Load files
    todo!()
}

// ref: https://github.com/tauri-apps/tauri/issues/996#issuecomment-1263279485
#[tauri::command]
fn file_stat(filename: &str) -> Result<String, String> {
    let metadata = fs::metadata(filename).expect("Failed to stat file");
    let time = metadata.modified().expect("Failed to get mtime");
    let millis = time
        .duration_since(UNIX_EPOCH)
        .expect("Failed to calculate mtime")
        .as_millis();

    let u64millis = u64::try_from(millis).expect("Integer too large");

    let is_file = if metadata.is_file() { "true" } else { "false" };
    let is_dir = if metadata.is_dir() { "true" } else { "false" };
    let size = metadata.len();

    return Ok(format!(
        "{{\"mtime\":{},\"isFile\":{},\"isDir\":{},\"size\":{}}}",
        u64millis, is_file, is_dir, size
    ));
}

// #[tauri::command]
// fn parse_cooklang(content: &str) -> Result<Recipe, String> {
//     let parse_result = parse(content, "N/A");
//     if parse_result.has_errors() {
//         // let err = match parse_result.errors() {
//         //     ParserError => "Parser error",
//         //     AnalysisError => "Analysis error",
//         //     Io => "Io error",
//         //     NoFilename => "No file name error",
//         // };
//         Err("TODO".to_string())
//     } else {
//         match parse_result.output() {
//             Some(r) => return Ok(r),
//             None => return Err("Recipe is none".to_string()),
//         }
//     }
// }

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // let package_info = app.package_info();
            // let resource_dir =
            //     path::resource_dir(package_info, &app.env()).expect("resources not found");
            // let mut data_dir = path::data_dir().expect("data not found");
            // let resource_str =
            //     String::from(resource_dir.clone().to_str().expect("couldn't to_str"));

            // create app local data
            let app_local_data_path = app
                .path_resolver()
                .app_local_data_dir()
                .expect("failed to resolve app local data dir");
            fs::create_dir_all(app_local_data_path).map_err(|e| e.to_string())?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![exec_wtd, file_stat, write_json])
        .plugin(
            tauri_plugin_log::Builder::default()
                .timezone_strategy(tauri_plugin_log::TimezoneStrategy::UseLocal)
                .targets([LogTarget::LogDir, LogTarget::Webview])
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
