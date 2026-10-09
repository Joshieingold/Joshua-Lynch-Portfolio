     private void ProcessCTRUpdate()
            {
                Microsoft.Win32.OpenFileDialog openFileDialog = new Microsoft.Win32.OpenFileDialog
                {
                    Title = "Select Excel File for CTR Update",
                    Filter = "Excel files (*.xlsx)|*.xlsx|All files (*.*)|*.*"
                };

                if (openFileDialog.ShowDialog() == true)
                {
                    string workbookPath = openFileDialog.FileName;

                    try
                    {
                        using (var workbookInstance = new XLWorkbook(workbookPath))
                        {
                            var sheet = workbookInstance.Worksheet(1); // Process the first sheet
                            Stopwatch stopwatch = new Stopwatch();
                            stopwatch.Start();
                            UpdateCTRS(sheet);
                            stopwatch.Stop();
                            TimeSpan ts = stopwatch.Elapsed;
                            string elapsedTime = String.Format("{0:00}h : {1:00}m : {2:00}s : {3:00} ms",
                            ts.Hours, ts.Minutes, ts.Seconds,
                            ts.Milliseconds / 10);
                            Console.WriteLine($"Ctr update completed in: {elapsedTime}");
                    }
                    }
                    catch (Exception ex)
                    {
                        System.Windows.MessageBox.Show($"Failed to process CTR update: {ex.Message}", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                    }
                }
            } // executes the main process by grabbing all neccesary data.
        private void UpdateCTRS(IXLWorksheet sheet)
            {
                string[] UpdateList = Settings.Default.CtrOrder.Split(", ");
                foreach (var row in sheet.RowsUsed())
                {
                    var RowCtrID = row.Cell(8).GetValue<string>();
                    var RowInventoryType = row.Cell(10).GetValue<string>();
                    var RowWarehouseCtrID = row.Cell(2).GetValue<string>();

                    if (UpdateList.Contains(RowCtrID) || UpdateList.Contains(RowWarehouseCtrID))
                    {
                        var matchedCtr = this.AllCtrs.FirstOrDefault(ctr => ctr.Name == RowCtrID || ctr.Name == RowWarehouseCtrID);
                        if (matchedCtr != null)
                        {
                            if (RowInventoryType.StartsWith("CTR.Subready."))
                            {
                                var RowDeviceCode = row.Cell(6).GetValue<string>();
                                matchedCtr.DevicePlusCounter(RowDeviceCode);
                            }
                            if (UpdateList.Contains(RowWarehouseCtrID))
                            {
                                var RowDeviceCode = row.Cell(6).GetValue<string>();
                                matchedCtr.DevicePlusCounter(RowDeviceCode);
                            }

                        }
                    }

                }
            }
        public async Task RunAutomation(string ThisCtr)
        {

            var ctr = AllCtrs.FirstOrDefault(c => c.Name == ThisCtr);
            if (ctr != null)
            {
                if (runCTRAutomation)
                {
                    Console.WriteLine($"\nProcessing {ThisCtr}");
                    System.Windows.Clipboard.SetText(ctr.ToString());

                    // Simulate key presses
                    await Task.Delay(3000); // Wait for clipboard operation to complete
                    var sim = new InputSimulator();
                    sim.Keyboard.ModifiedKeyStroke(WindowsInput.Native.VirtualKeyCode.CONTROL, WindowsInput.Native.VirtualKeyCode.VK_V);
                    await Task.Delay(3000); // Wait for paste operation to complete
                    sim.Keyboard.ModifiedKeyStroke(
                        new[] { WindowsInput.Native.VirtualKeyCode.CONTROL, WindowsInput.Native.VirtualKeyCode.MENU },
                        WindowsInput.Native.VirtualKeyCode.NEXT);

                    sim.Keyboard.ModifiedKeyStroke(
                        WindowsInput.Native.VirtualKeyCode.CONTROL,
                        WindowsInput.Native.VirtualKeyCode.LEFT);

                    await Task.Delay(CtrImportSpeed); // Wait for the specified import speed

                }
                else
                {
                    Console.WriteLine($"\n{ThisCtr} automation is disabled.");
                }
                DatabaseConnection databaseConnection_CTR = new DatabaseConnection();
                await databaseConnection_CTR.PushCTRData(ctr.Name, ctr.DeviceList);
            }
            else
            {
                Console.WriteLine($"\n{ThisCtr} not found in the list.");
            }

        }
